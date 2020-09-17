import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
    
    const USERS = [{id: 'u1', name: "Nemanja Mandic", image: 'https://scontent.fbeg2-1.fna.fbcdn.net/v/t1.0-9/96244455_10222081759578016_8393552787257950208_o.jpg?_nc_cat=107&_nc_sid=85a577&_nc_ohc=IxclDj7XmcAAX8LbWVs&_nc_ht=scontent.fbeg2-1.fna&oh=0e2ab8c30bc8e37ef1bbdb1de1ea3c77&oe=5F53FF41', places: 3}];

    return ( <UsersList items={USERS} /> );
}
 
export default Users;