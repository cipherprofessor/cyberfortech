import { SignIn } from "@clerk/nextjs";
import styles from "./sign-in.module.scss";

export default function SignInPage() {
  return (
    <div className={styles.signInContainer}>
      <SignIn 
        appearance={{
          elements: {
            rootBox: styles.signInBox,
            card: styles.signInCard,
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