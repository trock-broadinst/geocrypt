import styles from "@/styles/Home.module.css";
import React, { Dispatch, SetStateAction } from "react";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,100}$/;

function HandlePassword(props: {
  setPassword: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { setPassword } = props;
  const passwordInput = React.useRef<HTMLInputElement>(null);
  const confirmPasswordInput = React.useRef<HTMLInputElement>(null);
  const passwordZone = React.useRef<HTMLInputElement>(null);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);

  // React.useEffect(() => getPassword(), [passwordInput, confirmPasswordInput]);

  const getPassword = () => {
    const password = passwordInput.current?.value;
    const confirmPassword = confirmPasswordInput.current?.value;
    const passwordErrorZone = passwordZone.current;
    const addPwError = (msg: string[]) => {
      if (passwordErrorZone) {
        passwordErrorZone.innerHTML = "";
        msg.forEach((m) => {
          const p = document.createElement("p");
          p.setAttribute("style", "color: red");
          p.innerHTML = m;
          passwordErrorZone.appendChild(p);
        });
      }
    };
    if (!password || !confirmPassword) {
      setPassword(undefined);
      return addPwError(["please confirm password"]);
    }
    if (password !== confirmPassword) {
      setPassword(undefined);
      return addPwError(["passwords do not match"]);
    }
    if (!passwordRegex.test(password)) {
      setPassword(undefined);
      return addPwError([
        "password must be at least 6 characters long, contain at least one number and one capital letter",
      ]);
    }

    if (passwordErrorZone) passwordErrorZone.innerHTML = "";
    return setPassword(password);
  };
  return (
    <>
      <input
        ref={passwordInput}
        type={passwordVisible ? "text" : "password"}
        id="password1"
        className={styles.textbox}
        style={{ marginBottom: "0.5rem" }}
        onChange={getPassword}
        placeholder="Enter password"
      />
      <br />
      <input
        ref={confirmPasswordInput}
        type={passwordVisible ? "text" : "password"}
        id="password2"
        className={styles.textbox}
        style={{ marginBottom: "0.5rem" }}
        onChange={getPassword}
        placeholder="Confirm password"
      />
      <br />
      <button
        type="button"
        style={{ width: "100%" }}
        onClick={() => setPasswordVisible(!passwordVisible)}
      >
        ⏿
      </button>
      <br />
      <div ref={passwordZone} />
      <br />
    </>
  );
}

export default HandlePassword;
