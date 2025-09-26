import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store";
import { logout, updateProfile } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated, status } = useSelector(
    (state: RootState) => state.auth
  );

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        date_of_birth: user.date_of_birth || "",
      });
      if (user.profile_picture) {
        setPreviewUrl(user.profile_picture);
      }
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    const formData = new FormData();

    Object.entries(profileData).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    if (profilePicture) {
      formData.append("profile_picture", profilePicture);
    }

    try {
      await dispatch(updateProfile(formData));
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  if (!user) {
    return <div className='p-6'>Loading or redirecting...</div>;
  }

  const TabButton = ({
    id,
    label,
    isActive,
    onClick,
  }: {
    id: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium rounded-lg transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
      }`}>
      {label}
    </button>
  );

  const ProfileContent = () => (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          Profile Information
        </h2>
        <div className='space-x-3'>
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className='px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={status === "loading"}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50'>
                {status === "loading" ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Personal Information */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-gray-700 border-b pb-2'>
            Personal Information
          </h3>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              First Name
            </label>
            {isEditing ? (
              <input
                type='text'
                name='first_name'
                value={profileData.first_name}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-2 rounded'>
                {user.first_name || "Not provided"}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Last Name
            </label>
            {isEditing ? (
              <input
                type='text'
                name='last_name'
                value={profileData.last_name}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-2 rounded'>
                {user.last_name || "Not provided"}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type='date'
                name='date_of_birth'
                value={profileData.date_of_birth}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-2 rounded'>
                {user.date_of_birth
                  ? new Date(user.date_of_birth).toLocaleDateString()
                  : "Not provided"}
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-gray-700 border-b pb-2'>
            Contact Information
          </h3>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Email Address
            </label>
            <p className='text-gray-900 bg-gray-50 p-2 rounded'>{user.email}</p>
            <p className='text-xs text-gray-500 mt-1'>
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Phone Number
            </label>
            {isEditing ? (
              <input
                type='tel'
                name='phone_number'
                value={profileData.phone_number}
                onChange={handleInputChange}
                placeholder='+1 (555) 123-4567'
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-2 rounded'>
                {user.phone_number || "Not provided"}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Address
            </label>
            {isEditing ? (
              <textarea
                name='address'
                value={profileData.address}
                onChange={handleInputChange}
                rows={3}
                placeholder='123 Main St, City, State 12345'
                className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-2 rounded min-h-[80px]'>
                {user.address || "Not provided"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersContent = () => (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold text-gray-800'>Order History</h2>
      <div className='bg-gray-50 p-8 rounded-lg text-center'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400 mb-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
          />
        </svg>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No orders yet
        </h3>
        <p className='text-gray-500 mb-4'>
          When you make your first purchase, your orders will appear here.
        </p>
        <button
          onClick={() => router.push("/products")}
          className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors'>
          Start Shopping
        </button>
      </div>
    </div>
  );

  const PaymentMethodsContent = () => (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          Payment Methods
        </h2>
        <button className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
          Add Payment Method
        </button>
      </div>
      <div className='bg-gray-50 p-8 rounded-lg text-center'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400 mb-4'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
          />
        </svg>
        <h3 className='text-lg font-medium text-gray-900 mb-2'>
          No payment methods
        </h3>
        <p className='text-gray-500 mb-4'>
          Add a payment method to make checkout faster and easier.
        </p>
        <p className='text-sm text-gray-400'>
          Credit cards, debit cards, and digital wallets accepted
        </p>
      </div>
    </div>
  );

  return (
    <main className='container mx-auto p-4'>
      <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8'>
          <div className='flex items-center space-x-6'>
            <div className='relative'>
              <div className='w-24 h-24 rounded-full overflow-hidden bg-gray-200'>
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt='Profile'
                    width={96}
                    height={96}
                    className='object-cover w-full h-full'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-300 flex items-center justify-center text-gray-600'>
                    <svg
                      className='w-12 h-12'
                      fill='currentColor'
                      viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                )}
              </div>
              {isEditing && activeTab === "profile" && (
                <label className='absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer hover:bg-blue-700'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                  </svg>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />
                </label>
              )}
            </div>
            <div className='text-white'>
              <h1 className='text-3xl font-bold'>
                {user.first_name} {user.last_name}
              </h1>
              <p className='text-blue-100'>@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions for Admin */}
        {user.is_staff && (
          <div className='mb-6'>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-medium text-blue-900'>
                    Admin Access
                  </h3>
                  <p className='text-sm text-blue-700'>
                    Manage your store from the admin dashboard
                  </p>
                </div>
                <button
                  onClick={() => router.push("/admin/dashboard")}
                  className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium'>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className='border-b border-gray-200 px-6'>
          <div className='flex space-x-1'>
            <TabButton
              id='profile'
              label='Profile'
              isActive={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
            <TabButton
              id='orders'
              label='Orders'
              isActive={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            />
            <TabButton
              id='payments'
              label='Payment Methods'
              isActive={activeTab === "payments"}
              onClick={() => setActiveTab("payments")}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className='p-6'>
          {activeTab === "profile" && <ProfileContent />}
          {activeTab === "orders" && <OrdersContent />}
          {activeTab === "payments" && <PaymentMethodsContent />}

          {/* Logout Button */}
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <button
              onClick={handleLogout}
              className='w-full sm:w-auto bg-red-600 text-white px-6 py-3 rounded-md font-medium hover:bg-red-700 transition-colors'>
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
