import { useSelector } from "react-redux";
import LoadingSpinner from "./LoadingSpinner.js";
import NavBar from "./NavBar.js"

export const AuthNavBar = (props) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading &&
        (isAuthenticated ? (
          <>
            <NavBar />
            {props.member}
          </>
        ) : (
          <>
            <NavBar />
            {props.guest}
          </>
        ))
      }
    </>
  )
}