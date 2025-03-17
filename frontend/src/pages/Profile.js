import React, { useState } from "react";
import { useUser } from "../contexts/UserContexts";

const Profile = () => {
  const { user } = useUser();

  // State for controlling the "Edit Details" button
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // State for each editable field
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-500 via-blue-300 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto mt-12">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Profile
        </h2>


        {/* Before Edit - Show Details */}
        {!isEditingDetails ? (
          <div>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Username</label>
                <p className="p-3 border border-gray-300 rounded-md bg-gray-100">
                  {user.name}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Email</label>
                <p className="p-3 border border-gray-300 rounded-md bg-gray-100">
                  {user.email}
                </p>
              </div>
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Password</label>
                <p className="p-3 border border-gray-300 rounded-md bg-gray-100">
                  ********
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditingDetails(true)}
              className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
            >
              Edit Details
            </button>
          </div>
        ) : (
          // After clicking Edit Details - show edit sections separately
          <div className="space-y-4 mt-6">
            {/* Username Section */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Username</label>
              {isEditingUsername ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md bg-gray-100"
                  />
                  <button
                    onClick={() => setIsEditingUsername(false)}
                    className="mt-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="p-3 border border-gray-300 rounded-md bg-gray-100">
                    {user.name}
                  </p>
                  <button
                    onClick={() => setIsEditingUsername(true)}
                    className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Email Section */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Email</label>
              {isEditingEmail ? (
                <>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="p-3 border border-gray-300 rounded-md bg-gray-100"
                  />
                  <button
                    onClick={() => setIsEditingEmail(false)}
                    className="mt-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="p-3 border border-gray-300 rounded-md bg-gray-100">
                    {user.email}
                  </p>
                  <button
                    onClick={() => setIsEditingEmail(true)}
                    className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Password Section */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Password</label>
              {isEditingPassword ? (
                <>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700">
                      Old Password
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700">
                      Retype New Password
                    </label>
                    <input
                      type="password"
                      value={retypeNewPassword}
                      onChange={(e) => setRetypeNewPassword(e.target.value)}
                      className="p-3 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(false)}
                    className="mt-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="p-3 border border-gray-300 rounded-md bg-gray-100">
                    ********
                  </p>
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setIsEditingDetails(false)}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
