import { useState } from "react";
import { Button, Modal, PasswordInput, TextInput } from "@mantine/core";
import { IconArrowRight, IconLock } from "@tabler/icons-react";
import Brand from "../components/Brand";

export default function WorkspaceLandingPage({ onLogin, onBack, initialLoginOpen = false }) {
  const [loginOpen, setLoginOpen] = useState(initialLoginOpen);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onLogin(username, password);
    } catch (loginError) {
      setError(loginError.response?.status === 401 || loginError.response?.status === 403
        ? "Those details weren’t recognized. Check them and try again."
        : loginError.message || "Could not sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="workspace-welcome">
      <button className="workspace-back" onClick={onBack}>← Back to Tomo</button>
      <section className="workspace-welcome-content">
        <Brand />
        <h1>Make room for the work that matters.</h1>
        <Button className="tomo-landing-button" onClick={() => setLoginOpen(true)} rightSection={<IconArrowRight size={17} />}>Sign in</Button>
      </section>
      <Modal opened={loginOpen} onClose={() => setLoginOpen(false)} title="Sign in to Tomo" centered size="md" radius="lg">
        <div className="tomo-modal-intro"><span className="tomo-modal-lock"><IconLock size={19} /></span><div><strong>Welcome back</strong><p>Use your workspace account to continue.</p></div></div>
        <form className="tomo-modal-form" onSubmit={submit}>
          <TextInput label="Username" placeholder="Your username" autoComplete="username" value={username} onChange={(event) => setUsername(event.currentTarget.value)} required />
          <PasswordInput label="Password" placeholder="Your password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} required />
          {error && <p className="login-error" role="alert">{error}</p>}
          <Button type="submit" className="tomo-landing-button" loading={submitting} rightSection={<IconArrowRight size={17} />}>Sign in</Button>
          <p className="tomo-modal-secure"><IconLock size={13} /> Your sign-in details stay in this browser session.</p>
        </form>
      </Modal>
    </main>
  );
}
