import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, fetchUser, emailPasswordLogin } = useContext(UserContext);

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

  const loadUser = async () => {
    if (!user) {
      const fetchedUser = await fetchUser();
      if (fetchedUser) {
    
        redirectNow();
      }
    }
  };

  useEffect(() => {
    loadUser()
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
  
  
  
      const user = await emailPasswordLogin(form.email, form.password);
      if (user) {
        redirectNow();
      }
    } catch (error) {
      if (error.statusCode === 401) {
        alert("Invalid username/password. Try again!");
      } else {
        alert(error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col max-w-xs mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        label="Email"
        type="email"
        name="email"
        value={form.email}
        onChange={onFormInputChange}
        placeholder="Email"
        className="mb-4 px-3 py-2 border border-gray-300 rounded"
      />
      <input
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={onFormInputChange}
        placeholder="Password"
        className="mb-4 px-3 py-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Signup</Link>
      </p>
    </form>
  );
}

export default Login;
