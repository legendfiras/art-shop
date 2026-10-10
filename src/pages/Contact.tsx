import { type FormEvent, useState } from "react";

export function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  }

  return (
    <main className="page narrow">
      <header className="page-head">
        <h1>Contact</h1>
        <p>@letsshopart</p>
      </header>
      <form className="stack-form" onSubmit={onSubmit}>
        <label>
          name
          <input name="name" required />
        </label>
        <label>
          email
          <input name="email" type="email" required />
        </label>
        <label>
          message
          <textarea name="message" rows={5} required />
        </label>
        <button className="account-pill" type="submit">
          send
        </button>
        {sent ? <p className="confirm">Message noted. Reach the shop at @letsshopart.</p> : null}
      </form>
    </main>
  );
}
