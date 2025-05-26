import { NavLink } from "react-router-dom";
import {
  ChartBarSquareIcon as ChartBarIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  UsersIcon,
  StarIcon,
  EnvelopeIcon,
  RectangleStackIcon,
  InboxIcon,
  FilmIcon,
  PhotoIcon,
  XMarkIcon as XIcon,
  ViewColumnsIcon,
  MegaphoneIcon, // Added for Promo Banner
} from "@heroicons/react/24/outline";

const Sidebar = ({ onClose }) => {
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: ChartBarIcon, exact: true },
    { name: "Banner", path: "/admin/banner", icon: RectangleStackIcon },
    { name: "Promo Banner", path: "/admin/promoBanner", icon: MegaphoneIcon },
    { name: "Categories", path: "/admin/categories", icon: Squares2X2Icon },
    {
      name: "SubCategories",
      path: "/admin/subcategory",
      icon: ViewColumnsIcon,
    },
    { name: "Products", path: "/admin/products", icon: ShoppingBagIcon },
    { name: "Orders", path: "/admin/orders", icon: InboxIcon },
    { name: "Images", path: "/admin/insta", icon: PhotoIcon },
    { name: "Videos", path: "/admin/videos", icon: FilmIcon },
    { name: "Users", path: "/admin/users", icon: UsersIcon },
    { name: "Reviews", path: "/admin/reviews", icon: StarIcon },
    { name: "Contact", path: "/admin/contact", icon: EnvelopeIcon },
  ];

  const handleNavClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center w-[150px] h-[110px] p-8">
        <img src="/images/logo-new2.png" alt="Logo" className="w-20" />
      </div>

      {/* Mobile close button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="text-lg font-semibold">Admin Panel</div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? "bg-[#B7B4FF] text-[#393185]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive
                      ? "text-[#393185]"
                      : "text-gray-400 group-hover:text-gray-500"
                  }`}
                />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
