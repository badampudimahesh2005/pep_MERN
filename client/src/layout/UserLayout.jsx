
import UserHeader from "../components/user/UserHeader";
import UserFooter from "../components/user/UserFooter";
const UserLayout = ({ children }) => {
  return (
    <>
      <UserHeader />
      <main className="container mx-auto py-4">
        {children}
      </main>
      <UserFooter />
    </>
  )
}

export default UserLayout;