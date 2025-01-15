import { IconBriefcase2, IconSchool } from '@tabler/icons-react';

export default function About() {
    const experiences = [
        {
            label: 'Internship',
            company: 'Krafters Texhnology',
            duration: '6 month',
            location: 'Kumari pati, Lalitpur',
        },
        {
            label: 'Junior JS Developer',
            company: 'NXIT',
            duration: 'Present',
            location: 'Tahachal, Kathmandu',
        },
    ]
    const education = [
        // {
        //     studyAt: 'Trilok Children`s Academy',
        //     location: 'Balaju-16, Kathmandu',
        //     course: 'SEE',
        //     year: '2017',
        // },
        // {
        //     studyAt: 'Ashirwad College',
        //     location: 'Abhiyan Marg, Kathmandu',
        //     course: '+2',
        //     year: '2017-2019',
        // },
        // {
        //     studyAt: 'Asian School of Management and Technology',
        //     location: 'Gangabu, Kathmandu',
        //     course: 'BIM',
        //     year: '2019-2024',
        // },
        {
            studyAt: 'Krafters Technology',
            location: 'Kumari pati, Lalitpur',
            course: 'Full Stack JS Development',
            year: '2024',
        },
    ]
    return (
        <section className="container mx-auto py-10 md:px-0 px-5">

            <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
                <div className={'roboto-slab-semibold'}> {/* sticky top-20 */}
                    <div className={'text-2xl font-bold '}>BG 2.31</div>
                    <div className={'md:text-[2.5rem] sm:text-[2rem] text-[1.5rem]  font-bold sticky top-28'}>
                        Besides, considering your
                        duty as a warrior, you should not waver. Indeed, for a warrior, there is no better engagement
                        than fighting for upholding of righteousness.
                    </div>
                </div>

                <div>
                    <div className={'md:text-[2.5rem] text-3xl font-bold mb-4'}>About</div>
                    <div className={'md:text-2xl text-xl'}>
                        <p className={'mb-4'}>
                            Bringing life to code and building bridges between technology and user comfort!
                            Hi, I'm Ajay Kumar Maharjan, a full-stack JavaScript developer targeting the essence of
                            innovation through my skills in MERN Stack.
                            Born and raised in the tech heartbeat of Kathmandu, I currently enhance web applications
                            with a
                            flair for dynamic, user-centric solutions.
                        </p>
                        <p className={'mb-4'}>
                            Since commencing my educational journey in Information Management,
                            I've embraced every learning opportunity and technological challenge,
                            turning them into stepping stones toward becoming an expert in my field.
                            Throughout my career, my projects have not just been tasks, but adventures in creating
                            impactful
                            tech that addresses real-world needs.
                            I am looking forward to connecting with professionals who share a passion for impactful
                            development.
                            Check out my latest project or drop a message to see how we can collaborate on technology
                            that
                            makes a difference!
                        </p>

                    </div>
                    <div className={'py-8'}>
                        <div className="md:text-[2.5rem] text-3xl font-bold flex gap-1 items-center mb-4">
                            <p className={'h-[34px] w-[34px]'}><IconBriefcase2 stroke={2}
                                                                               style={{
                                                                                   height: '100%',
                                                                                   width: '100%'
                                                                               }}/>
                            </p>
                            <p>Experiences</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            {experiences.map((experience: any, index: number) => (
                                <div key={index}>
                                    <div className="border p-6">
                                        <div className="text-xl mb-2">{experience.duration}</div>
                                        <div className="text-xl">
                                            <label className="font-bold">{experience.label}</label>
                                            <p>{experience.company}, {experience.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="md:text-[2.5rem] text-3xl font-bold flex gap-1 items-center">
                            <p className={'h-[34px] w-[34px]'}><IconSchool stroke={2}
                                                                           style={{height: '100%', width: '100%'}}/></p>
                            <p>Certificate</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            {education.map((education: any, index: number) => (
                                <div key={index}>
                                    <div className="border p-6">
                                        <div className="text-xl mb-2">{education.year}</div>
                                        <div className="text-xl">
                                            <label className="font-bold">{education.course}</label>
                                            <p>{education.studyAt}, {education.location}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </section>
    )
}