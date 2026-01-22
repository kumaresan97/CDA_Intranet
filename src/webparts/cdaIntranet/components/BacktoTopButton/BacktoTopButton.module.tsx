import * as React from 'react';
import styles from './BacktoTopButton.module.scss';

interface BackToTopProps {
    scrollContainerRef?: React.RefObject<HTMLElement>;
}

const BackToTopButton: React.FC<BackToTopProps> = ({ scrollContainerRef }) => {
    const [show, setShow] = React.useState(false);

    const scrollToTop = () => {
        scrollContainerRef?.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    React.useEffect(() => {
        const container = scrollContainerRef?.current;
        if (!container) return;

        const handleScroll = () => {
            setShow(container.scrollTop < 300);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [scrollContainerRef]);

    return (
        <button
            className={`${styles.backtoTop} ${show ? styles.show : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
            type="button"
        >
            <i className="fas fa-arrow-up"></i>
        </button>
    );
};

export default BackToTopButton;

// import * as React from 'react';
// import styles from './BacktoTopButton.module.scss';

// const BackToTopButton: React.FC = () => {
//     const [show, setShow] = React.useState(false);

//     React.useEffect(() => {
//         const handleScroll = () => {
//             setShow(window.scrollY > 300);
//         };

//         window.addEventListener("scroll", handleScroll, { passive: true });
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     const scrollToTop = () => {
//         debugger;
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     return (
//         <button
//             className={`${styles.backtoTop} ${show ? styles.show : ""}`}
//             onClick={scrollToTop}
//             aria-label="Back to top"
//         >
//             <i className="fas fa-arrow-up" />
//         </button>
//     );
// };
// export default BackToTopButton;

