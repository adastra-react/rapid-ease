// "use client";

// import { sidebarItems } from "@/data/dashboard";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";

// export default function Sidebar({ setSideBarOpen }) {
//   const pathname = usePathname();
//   return (
//     <div className='dashboard__sidebar js-dashboard-sidebar'>
//       <div className='dashboard__sidebar_header'>
//         <span
//           onClick={() => setSideBarOpen(false)}
//           class='text-white closeSidebar'>
//           &times;
//         </span>
//         <Link href={"/"}>
//           <Image
//             width='130'
//             height='27'
//             src='/img/general/logo-3.png'
//             alt='logo icon'
//             priority
//           />
//         </Link>
//       </div>

//       <div className='sidebar -dashboard'>
//         {sidebarItems.map((elm, i) => (
//           <div
//             key={i}
//             className={`sidebar__item ${
//               pathname == elm.href ? "-is-active" : ""
//             } `}>
//             <Link href={elm.href}>
//               <i className={elm.iconClass}></i>
//               <span className='ml-10'>{elm.label}</span>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { sidebarItems } from "@/data/dashboard";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { logout } from "../../app/lib/auth";

export default function Sidebar({ setSideBarOpen }) {
  const pathname = usePathname();

  const handleClick = (elm) => {
    // If it's logout, call logout function
    if (elm.label === "Logout") {
      logout();
    }
  };

  return (
    <div className='dashboard__sidebar js-dashboard-sidebar'>
      <div className='dashboard__sidebar_header'>
        <span
          onClick={() => setSideBarOpen(false)}
          className='text-white closeSidebar'>
          &times;
        </span>
        <Link href={"/"}>
          <Image
            width='130'
            height='27'
            src='/img/general/logo-3.png'
            alt='logo icon'
            priority
          />
        </Link>
      </div>

      <div className='sidebar -dashboard'>
        {sidebarItems.map((elm, i) => (
          <div
            key={i}
            className={`sidebar__item ${
              pathname == elm.href ? "-is-active" : ""
            } `}>
            <Link href={elm.href} onClick={() => handleClick(elm)}>
              <i className={elm.iconClass}></i>
              <span className='ml-10'>{elm.label}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
