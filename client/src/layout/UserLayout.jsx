
import UserHeader from "../components/user/UserHeader";
import UserFooter from "../components/user/UserFooter";
const UserLayout = ({ children }) => {
  return (
  <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-1 pb-6">
        {children}
      </main>
      <UserFooter />
    </div>
  )
}

export default UserLayout;