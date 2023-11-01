import { useEffect, useState } from 'react';
import { collection, getDocs,  } from 'firebase/firestore';
import { db } from '../../firebase';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshots = await getDocs(usersCollection);
      const usersData = userSnapshots.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
      setUsers(usersData);
      console.log(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-6">
      <h2 className="text-xl text-gray-300 mb-4">Users:</h2>
      <ul>
        {users.map(user => (
          <li key={user.uid} className="mb-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 shadow-lg">
           <Link key={user.uid} to={`/messages/${user.uid}`}>

              <div className="flex items-center space-x-4">
                <img src={user?.photoURL} alt={user.name} width="50" className="rounded-full" />
                <h1 className="text-lg text-red-400">{user.displayName}</h1>
              </div>
              {/* Additional elements or buttons can be added here */}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
