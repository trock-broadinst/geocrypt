import styles from "@/styles/Home.module.css";
import PasswordValidator from "password-validator";
import React, { Dispatch, SetStateAction } from "react";

const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces();

const HandlePassword = (props: {
  setPassword: Dispatch<SetStateAction<string | undefined>>;
}) => {
  const { setPassword } = props;
  const passwordInput = React.useRef<HTMLInputElement>(null);
  const confirmPasswordInput = React.useRef<HTMLInputElement>(null);
  const passwordZone = React.useRef<HTMLInputElement>(null);

  // React.useEffect(() => getPassword(), [passwordInput, confirmPasswordInput]);

  const getPassword = () => {
    const password = passwordInput.current?.value;
    const confirmPassword = confirmPasswordInput.current?.value;
    const passwordErrorZone = passwordZone.current;
    let pweOccured = false;
    const addPwError = (msg: string[]) => {
      if (passwordErrorZone) {
        pweOccured = true;
        passwordErrorZone.innerHTML = "";
        msg.forEach((m) => {
          const p = document.createElement("p");
          p.setAttribute("style", "color: red");
          p.innerHTML = m;
          passwordErrorZone.appendChild(p);
        });
      }
    };
    if (!password || !confirmPassword)
      return addPwError(["please confirm password"]);
    if (password !== confirmPassword)
      return addPwError(["passwords do not match"]);
    const validatedList = passwordSchema.validate(password, { details: true });
    if (typeof validatedList !== "boolean" && validatedList.length > 0)
      addPwError(validatedList.map((x) => x.message));
    if (pweOccured) return setPassword(undefined);
    else {
      if (passwordErrorZone) passwordErrorZone.innerHTML = "";
      return setPassword(password);
    }
  };
  return (
    <>
      <input
        ref={passwordInput}
        type="text"
        id="password1"
        className={styles.textbox}
        style={{ marginBottom: "0.5rem" }}
        onChange={getPassword}
        placeholder="Enter password"
      />
      <br />
      <input
        ref={confirmPasswordInput}
        type="text"
        id="password2"
        className={styles.textbox}
        onChange={getPassword}
        placeholder="Confirm password"
      />
      <br />
      <div ref={passwordZone}></div>
      <br />
    </>
  );
};

export default HandlePassword;
