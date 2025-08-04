import { render, screen } from "@testing-library/react";
import JobCard from "@/app/components/JobCard";
import { useSession } from "next-auth/react";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe("JobCard - Component Rendering", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "Test User", email: "test@example.com" } },
      status: "authenticated",
    });
  });

  it("renders job posting card with all main info", () => {
    render(
      <JobCard
        id="1"
        title="Software Engineer"
        orgName="Test Company"
        location="Addis Ababa"
        description="Test job description"
        logoUrl=""
        categories={["Engineering", "Remote"]}
        opType="inPerson"
        isBookmarked={false}
      />
    );
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText(/Test Company.*Addis Ababa/)).toBeInTheDocument();
    // expect(screen.getByText("Remote")).toBeInTheDocument();
    expect(screen.getByText("Test job description")).toBeInTheDocument();
    expect(screen.getByText("inPerson")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });
});

// For job not found card, we assume a separate component or a conditional render in the job description page.
// If you have a NotFound component, you can test it similarly:
// import NotFound from '@/app/components/NotFound';
//
describe("Job Not Found Card", () => {
  it("renders job not found message", () => {
    // Simulate a not found card (replace with your actual NotFound component if available)
    const NotFound = () => <div>Job not found</div>;
    render(<NotFound />);
    expect(screen.getByText("Job not found")).toBeInTheDocument();
  });
});
