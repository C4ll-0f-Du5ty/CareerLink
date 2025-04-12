        // Add interactivity here
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Community grid infinite scroll
        let communityItems = document.querySelectorAll('.community-item');
        let loadMoreButton = document.getElementById('load-more');

        function loadMoreCommunities() {
            // Simulate loading more items
            setTimeout(() => {
                for (let i = 0; i < 12; i++) {
                    const newCommunityItem = communityItems[0].cloneNode(true);
                    document.querySelector('.grid-container').appendChild(newCommunityItem);
                }
                communityItems = document.querySelectorAll('.community-item');
            }, 1000);
        }

        loadMoreButton.addEventListener('click', loadMoreCommunities);
