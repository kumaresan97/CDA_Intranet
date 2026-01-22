/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { Skeleton } from 'antd';
import * as React from 'react'
import { getSpeechPageData } from '../../../Services/getManagerspeech';
import styles from "./MessageSection.module.scss"

const MessageSecction = ({ lang }: any) => {
    const [speechdata, setspeechdata] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const getSpeechPageDatas = async () => {

        setIsLoading(true)

        try {
            let data = await getSpeechPageData();
            setspeechdata(data ?? []);

        }
        catch (error) {
            console.log(error);


        }
        finally {
            setIsLoading(false)


        }
    }

    // const SpeechSkeleton = () => {
    //     return (
    //         <main className={styles.mainContainer}>
    //             {/* Page Header Skeleton */}
    //             <section className={styles.pageHeader}>
    //                 <Skeleton.Avatar
    //                     active
    //                     size={48}
    //                     shape="circle"
    //                     style={{ marginBottom: 12 }}
    //                 />
    //                 <Skeleton.Input
    //                     active
    //                     size="large"
    //                     style={{ width: 340, marginBottom: 8 }}
    //                 />
    //                 <Skeleton.Input
    //                     active
    //                     size="default"
    //                     style={{ width: 260 }}
    //                 />
    //             </section>

    //             {/* Card Skeleton */}
    //             <div className={`dds-card ${styles.ddsCard}`}>
    //                 <div className={styles.contentWrapper}>

    //                     {/* LEFT – Message Section */}
    //                     <div className={styles.messageSection}>
    //                         {/* Paragraph 1 */}
    //                         <Skeleton
    //                             active
    //                             title={false}
    //                             paragraph={{
    //                                 rows: 3,
    //                                 width: ["100%", "98%", "90%"]
    //                             }}
    //                         />

    //                         <div style={{ height: 16 }} />

    //                         {/* Paragraph 2 */}
    //                         <Skeleton
    //                             active
    //                             title={false}
    //                             paragraph={{
    //                                 rows: 3,
    //                                 width: ["100%", "96%", "88%"]
    //                             }}
    //                         />

    //                         <div style={{ height: 16 }} />

    //                         {/* Paragraph 3 */}
    //                         <Skeleton
    //                             active
    //                             title={false}
    //                             paragraph={{
    //                                 rows: 3,
    //                                 width: ["100%", "95%", "85%"]
    //                             }}
    //                         />
    //                     </div>

    //                     {/* RIGHT – Big Image Section */}
    //                     <div className={styles.imageSection}>
    //                         <Skeleton.Image
    //                             active
    //                             style={{
    //                                 width: "100%",
    //                                 height: 340,   // BIG IMAGE
    //                                 borderRadius: 8
    //                             }}
    //                         />

    //                         <Skeleton.Input
    //                             active
    //                             style={{ width: "70%", marginTop: 16 }}
    //                         />

    //                         <Skeleton.Input
    //                             active
    //                             size="small"
    //                             style={{ width: "85%", marginTop: 8 }}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         </main>
    //     );
    // };


    const SpeechSkeleton = () => {
        return (
            <main className={styles.mainContainer}>
                {/* Page Header Skeleton */}
                <section className={styles.pageHeader}>
                    <Skeleton.Avatar
                        active
                        size={48}
                        shape="circle"
                        style={{ marginBottom: 12 }}
                    />
                    <Skeleton.Input
                        active
                        size="large"
                        style={{ width: 320, marginBottom: 8 }}
                    />
                    <Skeleton.Input
                        active
                        size="default"
                        style={{ width: 260 }}
                    />
                </section>

                {/* Card Skeleton */}
                <div className={`dds-card ${styles.ddsCard}`} style={{ height: "400px" }}>
                    <div className={styles.contentWrapper}>
                        {/* Image + Name */}
                        <div className={styles.imageSection}>
                            <div style={{ height: "150px" }}>
                                <Skeleton.Image
                                    active
                                    style={{
                                        width: "100%",
                                        // height: 260,
                                        borderRadius: 8
                                    }}
                                />
                            </div>
                            <Skeleton.Input
                                active
                                size="default"
                                style={{ width: "70%", marginTop: 16, }}
                            />
                            <Skeleton.Input
                                active
                                size="small"
                                style={{ width: "85%", marginTop: 8 }}
                            />
                        </div>

                        {/* Message Content */}
                        <div className={styles.messageSection}>
                            <Skeleton
                                active
                                paragraph={{
                                    rows: 6,

                                    width: ["100%", "95%", "98%", "90%", "96%", "85%"]
                                }}
                                title={false}
                            />
                        </div>
                    </div>
                </div>
            </main>
        );
    };

    React.useEffect(() => {
        getSpeechPageDatas()

    }, [])
    return isLoading ? SpeechSkeleton() : (
        <div>

            <main className={styles.mainContainer}>
                {/* Page Header */}
                <section className={styles.pageHeader}>
                    <i className="fas fa-user-tie"></i>
                    <h1>{lang ? speechdata[0]?.titleAr : speechdata[0]?.title}</h1>
                    <p>{lang ? speechdata[0].designationAr : speechdata[0]?.designationEn}</p>
                </section>

                <div className={`dds-card ${styles.ddsCard}`}>
                    <div className={styles.contentWrapper}>
                        {/* Image and Title */}
                        <div className={styles.imageSection}>
                            <img
                                loading='lazy'
                                src={speechdata[0]?.image}
                                alt="معالي حصة بنت عيسى بوحميد"
                            />
                            <h3>{lang ? speechdata[0].nameAr : speechdata[0]?.nameEn}</h3>
                            <p>{lang ? speechdata[0].designationAr : speechdata[0]?.designationEn}</p>
                        </div>
                        {/* Message Text */}
                        <div className={styles.messageSection}>

                            {(lang ? speechdata[0]?.descAr : speechdata[0]?.descEn)
                                ?.split("\n")
                                .map((p: string, i: number) => (
                                    <p key={i}>{p}</p>
                                ))}
                        </div>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default MessageSecction
