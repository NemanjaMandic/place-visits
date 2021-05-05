import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "./../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "./../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "./../../shared/hooks/http-hook";

const Users = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/users");
        setUsers(responseData?.users);
      } catch (err) {
        
      }
     
    };
    fetchUsers();
  }, [sendRequest]);

 

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && users && <UsersList items={users} />}
    </>
  );
};

export default Users;
