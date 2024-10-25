import Navbar from '@/components/common/Navbar'
import CreateTodo from '@/components/ui/AddTodo/CreateTodo'
import React from 'react'

export default function index() {
  return (
    <div className="h-screen bg-gray-900">
      <Navbar/>
      <CreateTodo/>
    </div>
  )
}
