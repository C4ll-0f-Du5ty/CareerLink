// /* eslint-disable @typescript-eslint/no-unused-vars */
/* tailwindcss: ignore */

import styles from "./landingPage.module.css"
import { useEffect } from 'react';

function Landing() {

    useEffect(() => {
        // Add interactivity here
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // document.querySelectorAll('DOMContentLoaded', alert("Welcome Guest"))

        // Community grid infinite scroll
        // let communityItems = document.querySelectorAll('.community-item');
        // let loadMoreButton = document.getElementById('load-more');

        // function loadMoreCommunities() {
        //     setTimeout(() => {
        //         for (let i = 0; i < 12; i++) {
        //             const newCommunityItem = communityItems[0].cloneNode(true);
        //             document.querySelector('.grid-container').appendChild(newCommunityItem);
        //         }
        //         communityItems = document.querySelectorAll('.community-item');
        //     }, 1000);
        // }

        // loadMoreButton.addEventListener('click', loadMoreCommunities);
    }, []);


    return (
        <>
            <div className={styles.hero}>
                <div className={styles['hero-content']}>
                    <h1>Paint Your Social Story</h1>
                    <p>Where creativity meets connection</p>
                    <a href="/login" className={styles['cta-button']}>Join Now</a>
                </div>
            </div>


            <section className={styles.features}>
                <div className={styles['feature-card']}>
                    <img src="./images/privacy.png" alt="Feature Icon"
                        className={styles['feature-icon']} />
                    <h3>Enhanced Privacy</h3>
                    <p>Control who sees what you share</p>
                </div>
                <div className={styles['feature-card']}>
                    <img src="./images/tools.png" alt="Feature Icon" className={styles['feature-icon']} />
                    <h3>Creative Tools</h3>
                    <p>Express yourself with our unique features</p>
                </div>
                <div className={styles['feature-card']}>
                    <img src="./images/community.png" alt="Feature Icon" className={styles['feature-icon']} />
                    <h3>Community Building</h3>
                    <p>Join groups that share your interests</p>
                </div>
                <div className={styles['feature-card']}>
                    <img src="./images/cross.png" alt="Feature Icon" className={styles['feature-icon']} />
                    <h3>Cross-platform Syncing</h3>
                    <p>Access your content anywhere, anytime</p>
                </div>
            </section>

            <section className={styles['community-highlights']}>
                <div className={styles['grid-container']}>
                    <div className={styles['community-item']}>
                        <img src="./images/C1.jpg" alt="Community Image" />
                        <div className={styles.overlay}>
                            <h4>Artists Unite</h4>
                            <p>Join our vibrant art community</p>
                        </div>
                    </div>
                    <div className={styles['community-item']}>
                        <img src="./images/C2.jpg" alt="Community Image" />
                        <div className={styles.overlay}>
                            <h4>Foodies Corner</h4>
                            <p>Share your culinary adventures</p>
                        </div>
                    </div>
                    <div className={styles['community-item']}>
                        <img src="./images/C3.jpg" alt="Community Image" />
                        <div className={styles.overlay}>
                            <h4>Travel Enthusiasts</h4>
                            <p>Explore the world together</p>
                        </div>
                    </div>
                    {/* <!-- Add more community items here --> */}
                </div>
            </section>

            <section className={styles['cta-section']}>
                {/* <video autoplay loop muted playsinline>
                    <source src="background-video.mp4" type="video/mp4">
                </video>  */}
                <div className={styles['cta-content']}>
                    <h2>Ready to Connect?</h2>
                    <a href="/register" className={styles["large-cta-button"]}>Sign Up Now</a>
                    <p>Join over 1 million users worldwide</p>
                </div>
            </section>



            <footer>
                <div className={styles["footer-content"]}>
                    <div className={styles["footer-nav"]}>
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Contact Us</a></li>
                        </ul>
                    </div>
                    <div className={styles["footer-social"]}>
                        <h3>Follow Us</h3>
                        <div className={styles["social-links"]}>
                            <a href="#" target="_blank"><img src="./icons/apple.png" alt="Apple App Store" /></a>
                            <a href="#" target="_blank"><img src="./icons/google.png" alt="Google Play Store" /></a>
                            <a href="#" target="_blank"><img src="./icons/facebook.png" alt="Facebook" /></a>
                            <a href="#" target="_blank"><img src="./icons/twitter.png" alt="Twitter" /></a>
                            <a href="#" target="_blank"><img src="./icons/insta.png" alt="Instagram" /></a>
                        </div>
                    </div>
                    <div className={styles["footer-copyright"]}>
                        <p>&copy; 2023 Dusty. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Landing
