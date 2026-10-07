import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./HomePage";

jest.mock("../components/auth/AuthProvider", () => ({
  useAuth: () => ({ user: null, loading: false, isAdmin: false }),
}));

jest.mock("../context/CartContext", () => ({
  useCart: () => ({ itemCount: 0 }),
}));

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderHome(initial = "/") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/" element={<><HomePage /><LocationDisplay /></>} />
        <Route path="/imprimee" element={<><div>Physique home</div><LocationDisplay /></>} />
        <Route path="/invitations-physique" element={<><div>Physique</div><LocationDisplay /></>} />
      </Routes>
    </MemoryRouter>
  );
}

test("renders Main Digital landmark sections", () => {
  renderHome();
  expect(screen.getByRole("heading", { name: /pour tous les moments/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /les best-sellers/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /faq/i })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: /digitale/i })).toHaveAttribute("aria-selected", "true");
});

test("Imprimée toggle navigates to physical home", async () => {
  renderHome();
  await userEvent.click(screen.getByRole("tab", { name: /imprimée/i }));
  expect(screen.getByTestId("location")).toHaveTextContent("/imprimee");
});
