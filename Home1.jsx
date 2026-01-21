import React from 'react'
import '../App.css'
import { FaLinkedin, FaInstagram, FaGithub, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import { HiHand } from 'react-icons/hi'
const Home = () => {

    // Array of messages to display
    const messages = ["Hello!", "Welcome!"];
    let index = 0;

    // Function to change text
    function changeText() {
        index = (index + 1) % messages.length; // Loop through messages
        document.getElementById("changingText").textContent = messages[index];
    }

    // Change text every 2 seconds
    setInterval(changeText, 3000);
      
    return (


        <div className='w-full md-w-full sm-w-full overflow-hidden h-full' class='body' style={{
            background: "radial-gradient(circle at 50% 20%, #4c2685ff, #7745a0ff, #7745a0ff)",

        }}>

            { /* //   <div className="w-full min-h-screen bg-gradient-radial from-purple-900 via-purple-900/80 to-purple-800"> */}

            <nav className='fixed top-0 left-0 w-full items-center mx-auto justify-between  bg-black flex p-4 text-white  '>

                <h1 className='text-2xl pl-30 flex cursor-pointer font-bold decoration-purple-300'>Raf-<h1 className='text-purple-600'>Dev</h1></h1>
                <ul className='flex gap-3 [&>li]:font-bold [&>li]:rounded-3xl [&>li]:pr-3  [&>li]:flex [&>li]:items-center [&>li]:pl-3  [&>li>a]:hover:underline [&>li>a]:hover:decoration-5 [&>li>a]:hover:decoration-purple-700 [&>li>a]:hover:underline-offset-5' >
                    <li><a href="">  Home</a></li>
                    <li><a href="">  About</a></li>
                    <li><a href="">  Work</a></li>
                    <li><a href="">  Contact</a></li>
                </ul>
                <input type="search" className=' border rounded-2xl mr-30  p-1 pl-3 pr-20 ' placeholder="Search..." />

            </nav>



            <div className="grid pt-30 flex grid-cols-2 mb-70 text-white">
                <div className=' ml-40 mt-30'>
                    <h1 className='pl-2 flex items-center'>Hi! I am Raffay.<HiHand /></h1>
                    <br />
                    <h1 className='text-7xl font-bold' id='changingText' style={
                        {
                        }
                    }>Hello!</h1>

                    <br />
                    <p className='pl-2'>Developing new skills for Inovation!</p>
                    <br />
                    <button className='ml-2 text-2xl p-2 border  shadow-[0_0_10px_pink,0_0_20px_pink] hover:shadow-[0_0_10px_pink,0_0_20px_pink,0_0_50px_pink] items-center font-bold text-red-300  cursor-pointer hover:bg-red-200/10 border-red-200 rounded-2xl'>Download CV</button>

                    <div className="flex ml-2 m-8      [&>a]:bg-transparent      [&>a]:p-2  [&>a]:rounded-full [&>a]:justify-center [&>a]:items-center [&>a]:hover:shadow-[0_0_20px_pink] text-2xl text-white  w-50 gap-5 ">
                        <a href="" className=' '><FaGithub className="bg-transparent" />    </a>
                        <a href=""><FaInstagram /></a>
                        <a href=""><FaLinkedin /></a>
                        <a href=""><FaWhatsapp /></a>
                    </div>
                </div>

                <img src="./me2.jpg" className='w-40 flex ml-80 mt-35 rounded-full cursor-pointer shadow-[0_0_10px_pink,0_0_20px_pink] hover:shadow-[0_0_10px_pink,0_0_20px_pink,0_0_50px_pink]' alt="My-Pf." />

            </div>
            <div className='underline  flex mx-auto w-50 justify-center text-4xl font-bold text-white  items-center'>About me</div>
            <div className="grid grid-cols-2 h-80 mt-10  mb-50 text-white">

                <div className='w-130  ml-30  p-2  mt-10 '>
                    <p> I am Raffay, A computer Science student currently pursuing 7th Semester,
                        My goal is to work in diverse companies to learn and grow my skills from softwares
                        and Web development skills to Artificial Intelligence.</p>
                    <br />
                    <h2 className='font-bold text-2xl'>Skills & technologies</h2>
                    <br />
                    <div className='[&>button]:border [&>button]:p-2 [&>button]:rounded-3xl flex flex-wrap gap-5'>
                        <button>HTML</button>
                        <button>CSS,Tailwind</button>
                        <button>JavaScript</button>
                        <button>React</button>
                        <button>Node.js</button>
                        <button>React</button>

                    </div>
                </div>

                <div className=' ml-50 mt-10 w-130 bg-purple-900 border border-purple-900 [&>div]:border-purple-900 p-2 shadow-[0_0_10px_black] '>
                    <p className='text-xl mt-4 mx-5'>
                        const developer=[ <br />
                        <p className='mx-7'>
                            <br /> name:"Abdul Raffay",<br />
                            <br /> role: "Computer Science Student",<br />
                            <br /> passion: "Discovering Inovation" <br /><br />
                        </p>
                        ];


                    </p>

                </div>




            </div>
            <div className='underline  flex mx-auto w-50 justify-center text-4xl font-bold text-white  items-center'>Work</div>
            <div className='grid grid-cols-4 [&>div>button]:p-1 [&>div>button]:gap-1 [&>div>button]:rounded-full  [&>div>button]:p-2 [&>div]:border [&>div]:shadow-[0_0_10px_black] [&>div]:border-purple-800  text-white [&>div]:h-110 gap-5 px-40 mt-20 mb-20'>

                <div className=' [&>button]:border [&>button]:m-2  [&>button]:border-white  '>
                    <img src="public/logo.jpg" className='w-xl  h-50 ' alt="" />
                    <h2 className='font-bold text-xl m-2'> Book Shop's Website</h2>
                    <button>JavaScript</button>
                    <button>HTML</button>
                    <button>Tailwind Css</button>
                    <button className=' shadow-[0_0_10px_pink] border cursor-pointer hover:shadow-[0_0_20px_pink] '>GitHub</button>
                    <button className='shadow-[0_0_10px_pink] cursor-pointer hover:shadow-[0_0_20px_pink] '>LinkedIn</button>

                </div>
                <div className='[&>button]:border [&>button]:m-2  [&>button]:border-white '>
                    <img src="public/logo.jpg" className='w-xl  h-50' alt="" />
                    <h2 className='font-bold text-xl m-2'>Subscription Tracking app</h2>
                    <button>HTML</button>
                    <button>JavaScript</button>
                    <button>Node.js</button>
                    <button>React.js</button>
                    <br />
                    <button className='shadow-[0_0_10px_pink] border cursor-pointer hover:shadow-[0_0_20px_pink]'>GitHub</button>
                    <button className='shadow-[0_0_10px_pink] cursor-pointer hover:shadow-[0_0_20px_pink] '>LinkedIn</button>
                </div>
                <div className='[&>button]:border [&>button]:m-2  [&>button]:border-white '>
                    <img src="public/logo.jpg" className='w-xl  h-50' alt="" />
                    <h2 className='font-bold text-xl m-2'> Logistic Regression Model</h2>
                    <button>Python</button>
                    <button>Pandas</button>
                    <button>Sickit Learn</button>
                    <button>Python</button>
                    <br />
                    <button className=' shadow-[0_0_10px_pink] border cursor-pointer hover:shadow-[0_0_20px_pink]'>GitHub</button>
                    <button className='shadow-[0_0_10px_pink] cursor-pointer hover:shadow-[0_0_20px_pink] '>LinkedIn</button>
                </div>
                <div className='[&>button]:border [&>button]:m-2  [&>button]:border-white '>
                    <img src="public/logo.jpg" className='w-xl h-50' alt="" />
                    <h2 className='font-bold text-xl m-2'>  Sports Managing app</h2>
                    <button>React.js</button>
                    <button>Node.js</button>
                    <button>Scocket.io</button>
                    <button>HTML</button>
                    <button>Css</button>
                    <br />
                    <button className=' shadow-[0_0_10px_pink] border cursor-pointer hover:shadow-[0_0_20px_pink]'>GitHub</button>
                    <button className='shadow-[0_0_10px_pink] cursor-pointer hover:shadow-[0_0_20px_pink] '>LinkedIn</button>

                </div>

            </div>

            {/* <div className='underline  flex mx-auto w-50 justify-center text-4xl font-bold text-white  items-center'>About me</div> */}
            <div className='flex justify-center w-full text-white mt-40 font-bold text-3xl underline'>Get in touch</div>
            <div className='grid grid-cols-2 place-items-center text-white [&>div]:mt-20 [&>div]:w-150 [&>div]:h-90 [&>div]:mb-50 [&>div]:border [&>div]:border-purple-800 [&>div]:shadow-[0_0_10px_black] '>

                <div className='text-xl'>
                    <p className='m-3'>lets work together! I am ready to discuss every type of project, and dive into new Opportunities</p>
                    <div className='mt-10 [&>a]:gap-4 [&>a]:mt-5 [&>a]:w-1/2  [&>a]:m-3 '>
                        <a href="" className='flex items-align items-center'><FaEnvelope /> m.a.raffay.official@gmail.com</a>
                        <a href="" className='flex items-align items-center'><FaWhatsapp />+92 3235073652</a>
                        <a href="" className='flex items-align items-center'><FaMapMarkerAlt />Pakistan</a>
                    </div>
                    <div className='flex text-2xl [&>a]:bg-transparent [&>a]:cursor-pointer [&>a]:p-2 [&>a]:rounded-full [&>a]:hover:shadow-[0_0_10px_pink,0_0_20px_pink] [&>a]:mt-6 [&>a]:justify-center [&>a]:items-center [&>a]:ml-6 '>
                        <a href=""><FaLinkedin /></a>
                        <a href=""><FaGithub /></a>
                        <a href=""><FaInstagram /></a>

                    </div>
                </div>
                <div className='[&>input]:border  [&>input]:mt-7 [&>input]:mx-6 [&>input]:rounded-lg  flex flex-col '>
                    <input type="text" placeholder='Enter Name' className=' p-3' />
                    <input type="text" placeholder='Enter Email' className=' p-3' />
                    <input type="text" placeholder='Enter Message' className='pb-10 pl-3 pt-3' />
                    <button className='my-6 p-2 mx-7 cursor-pointer  hover:shadow-[0_0_20px_pink]  border border-pink font-bold text-white rounded-lg text-xl shadow-[0_0_10px_pink] bg-purple-500/10'>Send Message</button>
                </div>

            </div>
        </div>
    )
}

export default Home


