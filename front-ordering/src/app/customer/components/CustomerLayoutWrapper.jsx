'use client';
import NavBar from './NavBar';

export default function CustomerLayoutWrapper({ children }) {
  return (
    <>
      <NavBar />
      <main className="p-4">{children}</main>
    </>
  );
}