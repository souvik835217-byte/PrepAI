import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-white/10 bg-[#03050d] px-6 py-16"
    >
      <div className="max-w-7xl mx-auto">

        <div className="grid gap-12 md:grid-cols-3">

          <div>
            <h2 className="text-3xl font-medium tracking-[-0.04em] text-white">
              PrepAI
            </h2>

            <p className="text-gray-400 mt-4 leading-7">
              Practice DSA, compete in coding contests, analyze your resume,
              and prepare for interviews with AI—all in one platform.
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

            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              Connect
            </h3>

            <div className="flex gap-3 text-xl text-gray-400">
              <a
                href="https://github.com/souvik835217-byte/PrepAI"
                target="_blank"
                rel="noreferrer"
                aria-label="PrepAI on GitHub"
                title="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/5 hover:text-white"
              >
                <BsGithub />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/5 hover:text-white"
              >
                <BsLinkedin />
              </a>

              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                title="X"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition hover:-translate-y-1 hover:border-white/30 hover:bg-white/5 hover:text-white"
              >
                <BsTwitterX />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-white/10 pt-7 text-center text-sm text-gray-500">
          © 2026 PrepAI. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
