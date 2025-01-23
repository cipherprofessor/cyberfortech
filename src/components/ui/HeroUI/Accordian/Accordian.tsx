import {Accordion, AccordionItem, Avatar} from "@heroui/react";

export default function HeroUIAccordian() {
  const Accordian1Content ="We offer a wide range of cybersecurity courses including Network Security, Penetration Testing, Cloud Security, and more. Our courses are designed for both beginners and advanced professionals.";
 const Accordian2Content = "Course duration varies depending on the program. Most courses range from 8-12 weeks, with flexible learning options to fit your schedule.";
 const Accordian3Content = "Yes, we provide comprehensive job assistance including resume building, interview preparation, and connections with our industry partners.";
 const Accordian4Content = "Yes, all our courses are industry-certified. We partner with leading organizations to ensure our certifications are globally recognized.";
 const Accordian5Content = "We offer flexible payment options including installments, scholarships, and EMI options. Contact our finance team for more details.";

  return (
    <Accordion selectionMode="multiple">
      <AccordionItem
        key="1"
        aria-label="What courses do you offer?"
        startContent={
          <Avatar
            isBordered
            color="primary"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
        }
        subtitle="Below are the courses we offer"
        title="What courses do you offer?"
      >
        {Accordian1Content}
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Janelle Lenard"
        startContent={
          <Avatar
            isBordered
            color="success"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        }
        subtitle="It depends on below factors"
        title="How long are the courses?"
      >
        {Accordian2Content}
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Zoey Lang"
        startContent={
          <Avatar
            isBordered
            color="warning"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
        }
        subtitle={
          <p className="flex">
            Yes we do<span className="text-primary ml-1">provide</span>
          </p>
        }
        title="Do you provide job assistance?"
      >
        {Accordian3Content}
      </AccordionItem>
      <AccordionItem
        key="4"
        aria-label="Zoey Lang"
        startContent={
          <Avatar
            isBordered
            color="warning"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
        }
        subtitle={
          <p className="flex">
            Absolutely<span className="text-primary ml-1"></span>
          </p>
        }
        title="Are the courses certified?"
      >
        {Accordian4Content}
      </AccordionItem>
      <AccordionItem
        key="5"
        aria-label="Zoey Lang"
        startContent={
          <Avatar
            isBordered
            color="warning"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
        }
        subtitle={
          <p className="flex">
            We have a wide<span className="text-primary ml-1">range</span>
          </p>
        }
        title="What are the payment options?"
      >
        {Accordian5Content}
      </AccordionItem>
    </Accordion>
  );
}
