export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">ROOT PAGE WORKING</h1>
      <p>This is the root page at "/"</p>
      <p>If you see this, basic Next.js routing is working.</p>
      <div className="mt-4">
        <a href="/pt" className="text-blue-500">Go to /pt</a>
      </div>
    </div>
  );
}