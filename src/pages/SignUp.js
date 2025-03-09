import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { emailPasswordSignup } = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const onFormInputChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const redirectNow = () => {
    const redirectTo = location.search.replace("?redirectTo=", "");
    navigate(redirectTo ? redirectTo : "/");
  };

  const onSubmit = async () => {
    try {
      const user = await emailPasswordSignup(form.email, form.password);
      if (user) {
        redirectNow();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form className="flex flex-col max-w-xs mx-auto">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={onFormInputChange}
        placeholder="Email"
        className="mb-4 px-3 py-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={onFormInputChange}
        placeholder="Password"
        className="mb-4 px-3 py-2 border border-gray-300 rounded"
      />
      <button
        type="button"
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Signup
      </button>
      <p className="mt-4">
        Have an account already? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
      </p>
    </form>
  );
}

export default SignUp;
