
import { LoginPage } from './LoginPage';

export function SignupPage() {
    // For now, redirect to LoginPage or reuse it since we are prioritizing Google Auth
    // In the future, this will have a unique Email/Password registration form
    return <LoginPage />;
}
