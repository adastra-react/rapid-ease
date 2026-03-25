"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";
import Image from "next/image";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function Profile() {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("/img/dashboard/addtour/1.jpg");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    info: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const getInputWrapperClass = (value) =>
    `form-input${String(value ?? "").trim() ? " is-filled" : ""}`;

  const handleProfileChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event, func) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        func(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  return (
    <ProtectedRoute>
      <div
        className={`dashboard ${
          sideBarOpen ? "-is-sidebar-visible" : ""
        } js-dashboard`}>
        <Sidebar setSideBarOpen={setSideBarOpen} />

        <div className='dashboard__content'>
          <Header setSideBarOpen={setSideBarOpen} />

          <div className='dashboard__content_content'>
            <h1 className='text-30'>My Profile</h1>
            <p className=''>Lorem ipsum dolor sit amet, consectetur.</p>
            <div className='mt-50 rounded-12 bg-white shadow-2 px-40 pt-40 pb-30'>
              <h5 className='text-20 fw-500 mb-30'>Profile Details</h5>

              <div className='contactForm row y-gap-30'>
                <div className='col-md-6'>
                  <div className={getInputWrapperClass(profileData.firstName)}>
                    <input
                      type='text'
                      required
                      placeholder=' '
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleProfileChange("firstName", e.target.value)
                      }
                    />
                    <label className='lh-1 text-16 text-light-1'>Name</label>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className={getInputWrapperClass(profileData.lastName)}>
                    <input
                      type='text'
                      required
                      placeholder=' '
                      value={profileData.lastName}
                      onChange={(e) =>
                        handleProfileChange("lastName", e.target.value)
                      }
                    />
                    <label className='lh-1 text-16 text-light-1'>
                      Last Name
                    </label>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className={getInputWrapperClass(profileData.phone)}>
                    <input
                      type='text'
                      required
                      placeholder=' '
                      value={profileData.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                    />
                    <label className='lh-1 text-16 text-light-1'>Phone</label>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className={getInputWrapperClass(profileData.email)}>
                    <input
                      type='text'
                      required
                      placeholder=' '
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                    />
                    <label className='lh-1 text-16 text-light-1'>Email</label>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className={getInputWrapperClass(profileData.info)}>
                    <textarea
                      required
                      rows='8'
                      placeholder=' '
                      value={profileData.info}
                      onChange={(e) =>
                        handleProfileChange("info", e.target.value)
                      }></textarea>
                    <label className='lh-1 text-16 text-light-1'>Info</label>
                  </div>
                </div>

                <div className='col-12'>
                  <h4 className='text-18 fw-500 mb-20'>Your photo</h4>
                  <div className='row x-gap-20 y-gap'>
                    {image1 ? (
                      <div className='col-auto'>
                        <div className='relative'>
                          <Image
                            width={200}
                            height={200}
                            src={image1}
                            alt='image'
                            className='size-200 rounded-12 object-cover'
                          />
                          <button
                            onClick={() => {
                              setImage1("");
                            }}
                            className='absoluteIcon1 button -dark-1'>
                            <i className='icon-delete text-18'></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='col-auto'>
                        <label
                          htmlFor='imageInp1'
                          className='size-200 rounded-12 border-dash-1 bg-accent-1-05 flex-center flex-column'>
                          <Image
                            width='40'
                            height='40'
                            alt='image'
                            src={"/img/dashboard/upload.svg"}
                          />

                          <div className='text-16 fw-500 text-accent-1 mt-10'>
                            Upload Images
                          </div>
                        </label>
                        <input
                          onChange={(e) => handleImageChange(e, setImage1)}
                          accept='image/*'
                          id='imageInp1'
                          type='file'
                          style={{ display: "none" }}
                        />
                      </div>
                    )}
                    {image2 ? (
                      <div className='col-auto'>
                        <div className='relative'>
                          <Image
                            width={200}
                            height={200}
                            src={image2}
                            alt='image'
                            className='size-200 rounded-12 object-cover'
                          />
                          <button
                            onClick={() => {
                              setImage2("");
                            }}
                            className='absoluteIcon1 button -dark-1'>
                            <i className='icon-delete text-18'></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className='col-auto'>
                        <label
                          htmlFor='imageInp2'
                          className='size-200 rounded-12 border-dash-1 bg-accent-1-05 flex-center flex-column'>
                          <Image
                            width='40'
                            height='40'
                            alt='image'
                            src={"/img/dashboard/upload.svg"}
                          />

                          <div className='text-16 fw-500 text-accent-1 mt-10'>
                            Upload Images
                          </div>
                        </label>
                        <input
                          onChange={(e) => handleImageChange(e, setImage2)}
                          accept='image/*'
                          id='imageInp2'
                          type='file'
                          style={{ display: "none" }}
                        />
                      </div>
                    )}
                  </div>

                  <div className='text-14 mt-20'>
                    PNG or JPG no bigger than 800px wide and tall.
                  </div>

                  <button className='button -md -dark-1 bg-accent-1 text-white mt-30'>
                    Save Changes
                    <i className='icon-arrow-top-right text-16 ml-10'></i>
                  </button>
                </div>
              </div>
            </div>

            <div className='rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 mt-30'>
              <h5 className='text-20 fw-500 mb-30'>Change Password</h5>

              <div className='contactForm y-gap-30'>
                <div className='row y-gap-30'>
                  <div className='col-md-6'>
                    <div
                      className={getInputWrapperClass(
                        passwordData.currentPassword
                      )}>
                      <input
                        type='password'
                        required
                        placeholder=' '
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                      />
                      <label className='lh-1 text-16 text-light-1'>
                        Old password
                      </label>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6'>
                    <div
                      className={getInputWrapperClass(passwordData.newPassword)}>
                      <input
                        type='password'
                        required
                        placeholder=' '
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                      />
                      <label className='lh-1 text-16 text-light-1'>
                        New password
                      </label>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-md-6'>
                    <div
                      className={getInputWrapperClass(
                        passwordData.confirmPassword
                      )}>
                      <input
                        type='password'
                        required
                        placeholder=' '
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                      />
                      <label className='lh-1 text-16 text-light-1'>
                        Confirm new password
                      </label>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-12'>
                    <button className='button -md -dark-1 bg-accent-1 text-white'>
                      Save Changes
                      <i className='icon-arrow-top-right text-16 ml-10'></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='text-center pt-30'>
              © Copyright Rapid Eases {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
