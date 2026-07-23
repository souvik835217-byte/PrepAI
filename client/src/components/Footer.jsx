import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 bg-slate-950 border-t border-white/10 py-12 px-6"
    >
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
              <li>
                <a
                  href="/#home"
                  className="transition hover:text-white"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="/#features"
                  className="transition hover:text-white"
                >
                  Features
                </a>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="transition hover:text-white"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <a
                  href="/#contact"
                  className="transition hover:text-white"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              Connect
            </h3>

            <div className="flex gap-4 text-2xl text-gray-400">
              <a
                href="https://github.com/souvik835217-byte/PrepAI"
                target="_blank"
                rel="noreferrer"
                aria-label="PrepAI on GitHub"
                title="GitHub"
                className="transition hover:text-white"
              >
                <BsGithub />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="transition hover:text-white"
              >
                <BsLinkedin />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
                className="transition hover:text-white"
              >
                <BsTwitterX />
              </a>
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
