import React from "react";

const FAQs: React.FC = () => {
  const sampleArr = [
    "1. How can we participate? How does the new format work?",
    `2. Will WB in Launchpool or WB Vault count towards my participation limit calculation?`,
    `3. When do I need to commit my WB?`,
    `4. What does the hard cap per user mean?`,
    `5. Where is my committed WB locked during the subscription phase?`,
  ];

  return (
    <div className="dark:bg-blue-d2 bg-white py-20 px-4 xs:px-8 sm:px-12 md:px-20 lg:px-40">
      <h3 className="text-3xl md:text-4xl lg:text-5xl">FAQ&apos;s</h3>
      <div className="mt-10">
        {sampleArr.map((element, index) => (
          <p className="mt-4" key={index}>
            {element}
          </p>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
