import { type FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../store";

export function SignInPage() {
  const { signIn, signUp } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") || "/account";
  const [mode, setMode] = useState<"in" | "up">(params.get("mode") === "up" ? "up" : "in");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (mode === "in") {
      const message = signIn(email, password);
      setError(message);
      if (!message) navigate(next);
      return;
    }
    const name = String(data.get("name") ?? "").trim();
    const role = data.get("role") === "designer" ? "designer" : "collector";
    if (!name) {
      setError("Add your name.");
      return;
    }
    const message = signUp({ name, email, password, role });
    setError(message);
    if (!message) navigate(next);
  }

  return (
    <main className="page narrow">
      <header className="page-head">
        <h1>{mode === "in" ? "Sign in" : "setupure art account"}</h1>
        <p>
          {mode === "in"
            ? "Sign in to post work or to check out."
            : "Designers list apparel, prints, stickers, and other pieces. Collectors just need an account to order."}
        </p>
      </header>
      <form className="stack-form" onSubmit={onSubmit}>
        {mode === "up" ? (
          <label>
            name
            <input name="name" required />
          </label>
        ) : null}
        <label>
          email
          <input name="email" type="email" required />
        </label>
        <label>
          password
          <input name="password" type="password" required minLength={4} />
        </label>
        {mode === "up" ? (
          <fieldset>
            <legend>this account is for</legend>
            <label className="check">
              <input type="radio" name="role" value="designer" defaultChecked />
              posting art for sale
            </label>
            <label className="check">
              <input type="radio" name="role" value="collector" />
              buying work
            </label>
          </fieldset>
        ) : null}
        {error ? <p className="form-error">{error}</p> : null}
        <button className="account-pill" type="submit">
          {mode === "in" ? "Sign in" : "create account"}
        </button>
      </form>
      <button type="button" className="text-button" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Need an account? Set one up." : "Already posting? Sign in."}
      </button>
      <p className="fine">
        Accounts stay in this browser. <Link to="/about">How the shop works.</Link>
      </p>
    </main>
  );
}
