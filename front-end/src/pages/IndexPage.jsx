import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCartShopping } from "react-icons/fa6";
import { RiAccountCircleLine } from "react-icons/ri";
import { BiSearchAlt } from "react-icons/bi";
import { RiLeafFill } from "react-icons/ri";
import { FaHeadphones } from "react-icons/fa";
import { IoChatbubblesSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';


const IndexPage = () => {

  return (
    <div className="flex flex-col items-start justify-start gap-3 pt-0 bg-reset bg-body navbar-main-transparent">
      <div id="navbar-main" className="fixed-top">
  <nav className="bg-transparent navbar bg-primary navbar-dark navbar-expand-lg">
    <div className="container">
      <span className="gap-5 navbar-brand d-flex">
        <img
          src="//d37v7cqg82mgxu.cloudfront.net/img/active-listeners-therapy.svg"
          alt=""
          height="30"
          width="36"
        />
        <p className="text-white font-normal text-[16px]">Our Community</p>
<p className="text-white font-normal text-[16px]">Request Assistance</p>
<p className="text-white font-normal text-[16px]">Volunteer</p>
<p className="text-white font-normal text-[16px]">Exploring Therapy</p>
<p className="text-white font-normal text-[16px]">Partner Organizations</p>
      </span>
      <div className="flex items-center gap-2">
      <Link to="/login"  className="text-white font-medium text-[18px]">Login</Link>
      <Link to="/register"  className="text-white font-medium ml-3 text-[18px]">Sign-Up</Link>
      </div>
    </div>
  </nav>
</div>

      <section
  id="section-hero"
  className="min-w-full pb-3 min-vh-100 text-light pb-md-5 d-flex flex-column"
  style={{
    paddingTop: "54.1px",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundImage:
      "linear-gradient(270deg, rgba(58, 58, 58, 0.1) 0%, rgba(20, 20, 20, 0.5) 100%), url('https://wallpapers.com/images/hd/soothing-mv39d70ig1kgyg5y.jpg')",
  }}
>
  <div className="mb-5 ml-40 flex-grow-1 d-flex align-items-center">
    <div className="col-sm-8 col-md-8 col-lg-7 col-xl-6 col-xxl-5">

      <h1 className="w-full mb-0 fw-bold">
        Need someone to talk to? <br />
        Our counselors and listeners are standing by.
      </h1>
      <div
        className="mt-4 d-flex flex-column align-items-center"
        style={{ width: "fit-content" }}
      >
      </div>
    </div>
  </div>

  <div className="container-md">
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="row text-md-center">
          <div className="mb-2 col-2 col-sm-1 col-md-12">
          <IoChatbubblesSharp size={50} className='ml-48 text-white'></IoChatbubblesSharp>
          </div>
          <div className="col-10 col-sm-11 col-md-12">
            <h2 className="mb-0 fw-bold fs-4 mb-md-1">Free 24/7 Chat</h2>
            <p>
              MindFree connects you to caring listeners for free emotional
              support.
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <div className="row text-md-center">
          <div className="mb-2 col-2 col-sm-1 col-md-12">
          <FaHeadphones size={50} className='ml-48 text-white'></FaHeadphones>
          </div>
          <div className="col-10 col-sm-11 col-md-12">
            <h2 className="mb-0 fw-bold fs-4 mb-md-1">
              Affordable Therapy Online
            </h2>
            <p>
              Confidential online therapy &amp; coaching with licensed
              therapists for a low monthly fee.
            </p>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-6 col-lg-4">
        <div className="row text-md-center">
          <div className="mb-2 col-2 col-sm-1 col-md-12">
          <RiLeafFill size={50} className='ml-48 text-white'></RiLeafFill>
          </div>
          <div className="col-10 col-sm-11 col-md-12">
            <h2 className="mb-0 fw-bold fs-4 mb-md-1">Grow at Your Own Pace</h2>
            <p>
              Explore self-help guides &amp; growth paths for proven tips and
              advice on how to feel better.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  );
};

export default IndexPage;
