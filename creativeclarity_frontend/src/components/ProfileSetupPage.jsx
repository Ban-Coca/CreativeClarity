import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    institution: '',
    role: 'student',
    academicLevel: '',
    majorField: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store the first page data in localStorage
    localStorage.setItem('profileSetup1', JSON.stringify(formData));
    navigate('/profile-setup-2');
  };

  const inputClasses = "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-500 placeholder:opacity-60";
  const iconClasses = "h-5 w-5 opacity-60";

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Left side with video and logo */}
        <div className="hidden md:flex md:w-1/2 relative bg-gray-100">
          <div className="w-full h-full">
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/src/assets/CreativeClarityVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 flex items-center justify-center" 
                 style={{
                   background: 'linear-gradient(rgba(0, 0, 128, 0.4), rgba(0, 0, 128, 0.6))'
                 }}>
              <img
                src="/src/assets/images/whiteWordsLogo.png"
                alt="Creative Clarity"
                className="w-2/3 max-w-md"
              />
            </div>
          </div>
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            <img
              src="/src/assets/images/logoCreativeClarity.png"
              alt="Logo"
              className="h-16 mx-auto mb-6"
            />

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Profile Setup (1/2)</h2>
              <p className="text-gray-600 mt-2">Let&apos;s get to know you better</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img src="/src/assets/images/userIcon.png" alt="User" className={iconClasses} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="relative col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <img src="/src/assets/images/userIcon.png" alt="User" className={iconClasses} />
                    </div>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      className={inputClasses}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Institution */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="/src/assets/images/buildingIcon.png" alt="Institution" className={iconClasses} />
                  </div>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="Institution Name"
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              {/* Role */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="/src/assets/images/roleIcon.png" alt="Role" className={iconClasses} />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={inputClasses}
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="researcher">Researcher</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Academic Level */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Level</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="/src/assets/images/educationIcon.png" alt="Level" className={iconClasses} />
                  </div>
                  <input
                    type="text"
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleInputChange}
                    placeholder="e.g., Undergraduate"
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              {/* Major Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <img src="/src/assets/images/bookIcon.png" alt="Major" className={iconClasses} />
                  </div>
                  <input
                    type="text"
                    name="majorField"
                    value={formData.majorField}
                    onChange={handleInputChange}
                    placeholder="Major/Field of Study"
                    className={inputClasses}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;