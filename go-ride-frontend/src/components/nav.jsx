import { useGSAP } from "@gsap/react";
import React, { useRef, useState } from "react";
import ProfilePanel from "../pages/profilePanel";
import gsap from "gsap";

const Nav = (props) => {

     const [profilePanel, setProfilePanel] = useState(false);
      const profilePanelRef = useRef(null);

    useGSAP(
        function () {
          if(profilePanel) {
            gsap.to(profilePanelRef.current, {
              transform: 'translateX(0)',
              visibility:  "visible" ,
            });
          } else {
            gsap.to(profilePanelRef.current, {
              transform: 'translateX(100%)',
              visibility:  "hidden",
            });
          }
        },
        [profilePanel]
      );


  return (
    <div>
         <div className="flex flex-row relative z-[1] justify-between items-center bg-white h-15 px-4">
      <img
        className="w-24"
        src="/log.png"
        alt=""
      />
      <div className="rounded-full">
      <button onClick={() => {
        setProfilePanel(true)
      }} className="cursor-pointer">
              <i  className="ri-account-circle-fill text-2xl"></i>
      </button>
      </div>
      </div>





        <div ref={profilePanelRef}   className="fixed top-0 right-0 h-full w-[100%] bg-white shadow-lg transform translate-x-full  z-[100] p-6">
<ProfilePanel setProfilePanel={setProfilePanel} userLocation={props.userLocation} />
</div>
    </div>
  );
}
export default Nav;