import { SignUp } from "@clerk/nextjs";
import styles from "./sign-up.module.scss";

export default function SignUpPage() {
  return (
    <div className={styles.signUpContainer}>
      <SignUp
        appearance={{
          elements: {
            rootBox: styles.signUpBox,
            card: styles.signUpCard,
            headerTitle: styles.headerTitle,
            headerSubtitle: styles.headerSubtitle,
            socialButtonsBlockButton: styles.socialButton,
            formButtonPrimary: styles.primaryButton,
            footerAction: styles.footerText,
            dividerLine: styles.dividerLine,
            dividerText: styles.dividerText,
          },
        }}
      />
    </div>
  );
}