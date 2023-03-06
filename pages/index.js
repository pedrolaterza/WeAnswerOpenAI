import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [nameInput, setNameInput] = useState("");
  const [basicAnswerInput, setBasicAnswerInput] = useState("");
  const [emailTextarea, setEmailTextarea] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nameOrCompany: nameInput,
            basicAnswer: basicAnswerInput,
            emailText: emailTextarea,
          }),
        });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setNameInput("");
      setBasicAnswerInput("");
      setEmailTextarea("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  

  return (
    <div>
      <Head>
        <title>We Answer</title>
        <link rel="icon" href="/mail-check-line.svg" />
      </Head>

      <main className={styles.main}>
        <img src="/mail-check-line.svg" className={styles.icon} />
        <h3>Answer my E-mail or Message</h3>
        <form onSubmit={onSubmit}>
        <input
            type="text"
            name="nameOrCompany"
            placeholder="Put Your Name or Company"
            required
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <input
            type="text"
            name="basicAnswer"
            required
            placeholder="Write a Basic Answer"
            value={basicAnswerInput}
            onChange={(e) => setBasicAnswerInput(e.target.value)}
          />
          <textarea
            type="text"
            name="emailText"
            required
            placeholder="Email to be Answered"
            value={emailTextarea}
            onChange={(e) => setEmailTextarea(e.target.value)}
          />
          <input type="submit" value="ANSWER" />
        </form>
        <div className={styles.result}>{result}</div>

        <footer>
          <p>&copy; 2023 We Answer by <a target="_blank" href="https://www.linkedin.com/in/pedrolaterza/">Pedro Laterza</a>. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
