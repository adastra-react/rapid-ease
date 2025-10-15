// "use client";

// import Link from "next/link";
// import React from "react";

// export default function Login() {
//   return (
//     <section className="mt-header layout-pt-lg layout-pb-lg">
//       <div className="container">
//         <div className="row justify-center">
//           <div className="col-xl-6 col-lg-7 col-md-9">
//             <div className="text-center mb-60 md:mb-30">
//               <h1 className="text-30">Log In</h1>
//               <div className="text-18 fw-500 mt-20 md:mt-15">
//                 We're glad to see you again!
//               </div>
//               <div className="mt-5">
//                 Don't have an account?{" "}
//                 <Link href="/register" className="text-accent-1">
//                   Sign Up!
//                 </Link>
//               </div>
//             </div>

//             <form
//               onSubmit={(e) => e.preventDefault()}
//               className="contactForm border-1 rounded-12 px-60 py-60 md:px-25 md:py-30"
//             >
//               <div className="form-input ">
//                 <input type="email" required />
//                 <label className="lh-1 text-16 text-light-1">
//                   Email Address
//                 </label>
//               </div>

//               <div className="form-input mt-30">
//                 <input type="email" required />
//                 <label className="lh-1 text-16 text-light-1">Password</label>
//               </div>

//               <div className="row y-ga-10 justify-between items-center pt-30">
//                 <div className="col-auto">
//                   <div className="d-flex items-center">
//                     <div className="form-checkbox ">
//                       <input type="checkbox" name="name" />
//                       <div className="form-checkbox__mark">
//                         <div className="form-checkbox__icon">
//                           <svg
//                             width="10"
//                             height="8"
//                             viewBox="0 0 10 8"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M9.29082 0.971021C9.01235 0.692189 8.56018 0.692365 8.28134 0.971021L3.73802 5.51452L1.71871 3.49523C1.43988 3.21639 0.987896 3.21639 0.709063 3.49523C0.430231 3.77406 0.430231 4.22604 0.709063 4.50487L3.23309 7.0289C3.37242 7.16823 3.55512 7.23807 3.73783 7.23807C3.92054 7.23807 4.10341 7.16841 4.24274 7.0289L9.29082 1.98065C9.56965 1.70201 9.56965 1.24984 9.29082 0.971021Z"
//                               fill="white"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="lh-11 ml-10">Remember me</div>
//                   </div>
//                 </div>

//                 <div className="col-auto">
//                   <a href="#">Lost your password?</a>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="button -md -dark-1 bg-accent-1 text-white col-12 mt-30"
//               >
//                 Log In
//                 <i className="icon-arrow-top-right ml-10"></i>
//               </button>

//               <div className="relative line mt-50 mb-30">
//                 <div className="line__word fw-500">OR</div>
//               </div>

//               <div className="row y-gap-15">
//                 <div className="col">
//                   <button className="button -md -outline-blue-1 text-blue-1 col-12">
//                     <i className="icon-facebook mr-10"></i>
//                     Continue Facebook
//                   </button>
//                 </div>

//                 <div className="col">
//                   <button className="button -md -outline-red-1 text-red-1 col-12">
//                     <i className="icon-google mr-10"></i>
//                     Continue Google
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { login, isAuthenticated } from "../../app/lib/auth";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      router.push(redirect);
    }
  }, [router, redirect]);

  const handleSubmit = async () => {
    if (!credentials.email || !credentials.password) return;

    setLoading(true);
    setError("");

    const result = await login(credentials.email, credentials.password);

    if (result.success) {
      // Login successful - redirect
      router.push(redirect);
    } else {
      // Login failed - show error
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <section className='mt-header layout-pt-lg layout-pb-lg'>
      <div className='container'>
        <div className='row justify-center'>
          <div className='col-xl-6 col-lg-7 col-md-9'>
            <div className='text-center mb-60 md:mb-30'>
              <h1 className='text-30'>Log In</h1>
              <div className='text-18 fw-500 mt-20 md:mt-15'>
                We're glad to see you again!
              </div>
              <div className='mt-5'>
                Don't have an account?{" "}
                <Link href='/register' className='text-accent-1'>
                  Sign Up!
                </Link>
              </div>
            </div>

            <div className='contactForm border-1 rounded-12 px-60 py-60 md:px-25 md:py-30'>
              {/* Error Message */}
              {error && (
                <div
                  className='mb-20 px-20 py-15 rounded-8'
                  style={{
                    backgroundColor: "#fff5f5",
                    border: "1px solid #ffe0e0",
                    color: "#dc3545",
                  }}>
                  {error}
                </div>
              )}

              <div className='form-input'>
                <input
                  type='email'
                  required
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  disabled={loading}
                  autoComplete='email'
                />
                <label className='lh-1 text-16 text-light-1'>
                  Email Address
                </label>
              </div>

              <div
                className='form-input mt-30'
                style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  disabled={loading}
                  autoComplete='current-password'
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  style={{ paddingRight: "45px" }}
                />
                <label className='lh-1 text-16 text-light-1'>Password</label>
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "5px",
                    color: "#666",
                    fontSize: "18px",
                  }}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>

              <button
                type='button'
                onClick={handleSubmit}
                className='button -md -dark-1 bg-accent-1 text-white col-12 mt-30'
                disabled={
                  loading || !credentials.email || !credentials.password
                }
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor:
                    loading || !credentials.email || !credentials.password
                      ? "not-allowed"
                      : "pointer",
                }}>
                {loading ? "Logging in..." : "Log In"}
                <i className='icon-arrow-top-right ml-10'></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
