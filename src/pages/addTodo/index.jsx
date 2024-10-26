// Your existing component file

import Navbar from '@/components/common/Navbar';
import CreateTodo from '@/components/ui/AddTodo/CreateTodo';
import FriendsCircle from '@/components/ui/AddTodo/FriendsCircle';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import UserInviteModal from '@/components/ui/AddTodo/UserInviteModal';

export default function Index() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [startCri, setstartCri] = useState(false);

  const [Tasks, setTasks] = useState([]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  const startCriticise = () =>{
    setstartCri(!startCri);
  }

  const todoFetcher = (a) => {
    console.log(a)
    setTasks(a);
  }

  return (
    <div className="h-screen bg-gray-900">
      <Navbar />
      <div className="flex md:flex-row flex-col justify-around">
        <CreateTodo todoFetcher={todoFetcher} startCriticise={startCriticise} />
        <FriendsCircle Tasks={Tasks} setstartCri={setstartCri} />
      </div>
      <Toaster position="bottom-center" reverseOrder={true} />
      <div
        onClick={handleOpenModal}
        className="bg-white text-black py-5 px-7 text-xl rounded-full fixed bottom-3 right-3 cursor-pointer"
      >
        +
      </div>
      <UserInviteModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
