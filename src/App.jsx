import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import AboutUsPage from "./components/AboutUsPage";
import AllProductPage from "./components/AllProductPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import CombosPage from "./components/CombosPage";
import ContactUsPage from "./components/ContactUsPage";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import SingleProductPage from "./components/SingleProductPage";
import TrackOrderPage from "./components/TrackOrderPage";
import WishlistPage from "./components/WishlistPage";

// Admin Pages
import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Products from "./Admin/pages/Products";
import Category from "./Admin/pages/Categories";
import Contact from "./Admin/pages/Contact";
import Reviews from "./Admin/pages/Reviews";
import Users from "./Admin/pages/Users";
import Orders from "./Admin/pages/Orders";
import CategoryProducts from "./components/CategoryProducts";
import SubCategory from "./Admin/pages/SubCategory";
import SubCategoryPage from "./components/SubCategoryPage";
import Banner from "./Admin/pages/Banner";
import PromoBanner from "./components/PromoBanner";
import AdminPromoBanner from "./Admin/pages/AdminPromoBanner";
import InstaSections from "./Admin/pages/InstaSections";
import Videos from "./Admin/pages/Videos";
import Media from "./Admin/pages/Media";

const PublicLayout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ["/about", "/login", "/signup"];
  const hideFooterRoutes = ["/login", "/signup"];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      {!shouldHideHeader && <Header />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          className: "w-76",
          style: {
            background: "white",
            color: "#1f2937",
            padding: "14px 16px",
            borderRadius: "0.5rem",
            fontSize: "14px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            borderLeft: "4px solid #3b82f6",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#D1FAE5",
            },
            style: {
              borderLeft: "4px solid #10b981",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#FEE2E2",
            },
            style: {
              borderLeft: "4px solid #ef4444",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/products" element={<AllProductPage />} />
        <Route path="/combos" element={<CombosPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/subcategory/:cate_id" element={<CategoryProducts />} />
        <Route path="/products/:sub_cate_id" element={<SubCategoryPage />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Site Layout */}
        <Route path="/*" element={<PublicLayout />} />

        {/* Admin Panel Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="categories" element={<Category />} />
          <Route path="subcategory" element={<SubCategory />} />
          <Route path="users" element={<Users />} />
          <Route path="contact" element={<Contact />} />
          <Route path="orders" element={<Orders />} />
          <Route path="banner" element={<Banner />} />
          <Route path="promoBanner" element={<AdminPromoBanner />} />
          <Route path="insta" element={<InstaSections />} />
          <Route path="videos" element={<Videos />} />
          <Route path="medias" element={<Media />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
