// __tests__/Bookmark.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import JobCard from "@/app/components/JobCard";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

// ✅ Mock useSession and react-hot-toast
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));
jest.mock("react-hot-toast");

describe("JobCard - Bookmark Functionality", () => {
  const mockOnToggleBookmark = jest.fn();

  beforeEach(() => {
    // ✅ Provide a default mocked session
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: { name: "Test User1", email: "test@gmail.com" },
      },
      status: "authenticated",
    });
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it("renders and allows toggling bookmark", () => {
    render(
      <JobCard
        id="1"
        title="Software Engineer"
        orgName="Test Company"
        location="Remote"
        description="Test job description"
        logoUrl="https://example.com/logo.png"
        categories={["Engineering"]}
        opType="inPerson"
        isBookmarked={false}
        onToggleBookmark={mockOnToggleBookmark}
      />
    );

    const bookmarkBtn = screen.getByRole("button", { name: /bookmark/i });
    expect(bookmarkBtn).toBeInTheDocument();

    fireEvent.click(bookmarkBtn);
    expect(mockOnToggleBookmark).toHaveBeenCalledWith("1", false);
  });

  it("does not throw if onToggleBookmark is not provided", () => {
    render(
      <JobCard
        id="2"
        title="Backend Developer"
        orgName="Another Co"
        location="Ethiopia"
        description="Backend job description"
        logoUrl="https://example.com/logo2.png"
        categories={["Backend"]}
        opType="virtual"
        isBookmarked={true}
      />
    );

    const bookmarkBtn = screen.getByRole("button", { name: /bookmark/i });
    fireEvent.click(bookmarkBtn);
    // No error expected
  });

  it("shows toast when unauthenticated user clicks bookmark", () => {
    // Mock unauthenticated session
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(
      <JobCard
        id="3"
        title="Unauth Job"
        orgName="NoAuth Co"
        location="Nowhere"
        description="Should show toast on click"
        logoUrl="https://example.com/logo3.png"
        categories={["Test"]}
        opType="virtual"
        isBookmarked={false}
      />
    );
    const bookmarkBtn = screen.getByRole("button", { name: /bookmark/i });
    expect(bookmarkBtn).toBeInTheDocument();
    expect(bookmarkBtn).toBeEnabled();

    fireEvent.click(bookmarkBtn);

    expect(toast.error).toHaveBeenCalledWith("Please sign in to bookmark jobs");
  });
});
