
import UserHeader from "../components/user/UserHeader";
import UserFooter from "../components/user/UserFooter";
const UserLayout = ({ children }) => {
  return (
  <div className="flex flex-col ">
      <UserHeader />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <UserFooter />
    </div>
  )
}

export default UserLayout;