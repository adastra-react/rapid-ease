// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import React, { useState, useEffect } from "react";

// export default function Login() {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirect = searchParams.get("redirect") || "/dashboard";

//   // ✅ Lazy-import auth only on the client to avoid server/build eval
//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       if (typeof window === "undefined") return;
//       const { isAuthenticated } = await import("../../app/lib/auth");
//       if (mounted && isAuthenticated()) {
//         router.push(redirect);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, [router, redirect]);

//   const handleSubmit = async () => {
//     if (!credentials.email || !credentials.password) return;

//     setLoading(true);
//     setError("");

//     try {
//       const { login } = await import("../../app/lib/auth");
//       const result = await login(credentials.email, credentials.password);

//       if (result.success) {
//         router.push(redirect);
//       } else {
//         setError(result.error || "Login failed");
//         setLoading(false);
//       }
//     } catch (e) {
//       setError(e.message || "An unexpected error occurred");
//       setLoading(false);
//     }
//   };

//   return (
//     <section className='mt-header layout-pt-lg layout-pb-lg'>
//       <div className='container'>
//         <div className='row justify-center'>
//           <div className='col-xl-6 col-lg-7 col-md-9'>
//             <div className='text-center mb-60 md:mb-30'>
//               <h1 className='text-30'>Log In</h1>
//               <div className='text-18 fw-500 mt-20 md:mt-15'>
//                 {"We're glad to see you again!"}
//               </div>
//               <div className='mt-5'>
//                 {"Don't have an account? "}
//                 <Link href='/register' className='text-accent-1'>
//                   Sign Up!
//                 </Link>
//               </div>
//             </div>

//             <div className='contactForm border-1 rounded-12 px-60 py-60 md:px-25 md:py-30'>
//               {error && (
//                 <div
//                   className='mb-20 px-20 py-15 rounded-8'
//                   style={{
//                     backgroundColor: "#fff5f5",
//                     border: "1px solid #ffe0e0",
//                     color: "#dc3545",
//                   }}>
//                   {error}
//                 </div>
//               )}

//               <div className='form-input'>
//                 <input
//                   type='email'
//                   required
//                   value={credentials.email}
//                   onChange={(e) =>
//                     setCredentials({ ...credentials, email: e.target.value })
//                   }
//                   disabled={loading}
//                   autoComplete='email'
//                 />
//                 <label className='lh-1 text-16 text-light-1'>
//                   Email Address
//                 </label>
//               </div>

//               <div
//                 className='form-input mt-30'
//                 style={{ position: "relative" }}>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   required
//                   value={credentials.password}
//                   onChange={(e) =>
//                     setCredentials({ ...credentials, password: e.target.value })
//                   }
//                   disabled={loading}
//                   autoComplete='current-password'
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       e.preventDefault();
//                       handleSubmit();
//                     }
//                   }}
//                   style={{ paddingRight: "45px" }}
//                 />
//                 <label className='lh-1 text-16 text-light-1'>Password</label>
//                 <button
//                   type='button'
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: "absolute",
//                     right: "15px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     padding: "5px",
//                     color: "#666",
//                     fontSize: "18px",
//                   }}
//                   disabled={loading}
//                   aria-label={showPassword ? "Hide password" : "Show password"}>
//                   {showPassword ? "👁️" : "👁️‍🗨️"}
//                 </button>
//               </div>

//               <button
//                 type='button'
//                 onClick={handleSubmit}
//                 className='button -md -dark-1 bg-accent-1 text-white col-12 mt-30'
//                 disabled={
//                   loading || !credentials.email || !credentials.password
//                 }
//                 style={{
//                   opacity: loading ? 0.7 : 1,
//                   cursor:
//                     loading || !credentials.email || !credentials.password
//                       ? "not-allowed"
//                       : "pointer",
//                 }}>
//                 {loading ? "Logging in..." : "Log In"}
//                 <i className='icon-arrow-top-right ml-10' />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";

function LoginForm() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;
      const { isAuthenticated } = await import("../../app/lib/auth");
      if (mounted && isAuthenticated()) {
        router.push(redirect);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [router, redirect]);

  const handleSubmit = async () => {
    if (!credentials.email || !credentials.password) return;

    setLoading(true);
    setError("");

    try {
      const { login } = await import("../../app/lib/auth");
      const result = await login(credentials.email, credentials.password);

      if (result.success) {
        router.push(redirect);
      } else {
        setError(result.error || "Login failed");
        setLoading(false);
      }
    } catch (e) {
      setError(e.message || "An unexpected error occurred");
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
                {"We're glad to see you again!"}
              </div>
              <div className='mt-5'>
                {"Don't have an account? "}
                <Link href='/register' className='text-accent-1'>
                  Sign Up!
                </Link>
              </div>
            </div>

            <div className='contactForm border-1 rounded-12 px-60 py-60 md:px-25 md:py-30'>
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
                <i className='icon-arrow-top-right ml-10' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className='container mt-header layout-pt-lg'>
          <div className='text-center'>Loading...</div>
        </div>
      }>
      <LoginForm />
    </Suspense>
  );
}
