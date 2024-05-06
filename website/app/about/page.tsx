import React from 'react';

const AboutPage = () => {
    return (
        <div className="bg-gray-100 h-[calc(100vh-60px)] overflow-y-scroll py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">About Us</h1>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <p className="text-lg text-gray-700">
                        We are a team dedicated to simplifying the process of parsing resumes. 
                        Our mission is to provide an easy-to-use tool that helps recruiters and 
                        HR professionals extract valuable information from resumes efficiently.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
                    <p className="text-lg text-gray-700">
                        Our vision is to revolutionize the way resumes are handled in the 
                        recruitment process. By leveraging the latest technologies, we aim to 
                        streamline resume parsing, making it faster, more accurate, and 
                        ultimately saving valuable time for hiring teams.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
                    <ul className="list-disc pl-6">
                        <li className="text-lg text-gray-700 mb-2">Advanced Parsing Technology: Our cutting-edge parsing algorithms ensure accurate extraction of information from resumes.</li>
                        <li className="text-lg text-gray-700 mb-2">User-Friendly Interface: Our platform is designed with simplicity and ease of use in mind, making resume parsing effortless.</li>
                        <li className="text-lg text-gray-700 mb-2">Time-Saving Solution: With our tool, recruiters can parse resumes quickly, allowing them to focus on more strategic aspects of hiring.</li>
                        <li className="text-lg text-gray-700 mb-2">Customizable Solutions: We offer customizable parsing solutions tailored to the specific needs of your organization.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;