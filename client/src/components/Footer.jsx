import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-3xl font-bold text-white">
              PrepAI
            </h2>

            <p className="text-gray-400 mt-4 leading-7">
              AI-powered interview preparation platform helping students
              improve confidence, communication, and technical skills.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>Home</li>
              <li>Features</li>
              <li>Dashboard</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              Connect
            </h3>

            <div className="flex gap-4 text-2xl text-gray-400">
              <BsGithub className="hover:text-white cursor-pointer transition" />
              <BsLinkedin className="hover:text-white cursor-pointer transition" />
              <BsTwitterX className="hover:text-white cursor-pointer transition" />
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-500">
          © 2026 PrepAI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;