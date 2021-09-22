const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((previousValue, blog) => {
        return previousValue + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const blogScores = blogs.map(blog => blog.likes)
    const highestScore = Math.max(...blogScores)
    return blogs.find(blog => blog.likes >= highestScore)
}

const mostBlogs = (blogs) => {
    const blogCountsSorted = blogs.map(blog => {
        const blogObject = {
            author: blog.author,
            blogs: blogs.filter(blogFilter => blogFilter.author === blog.author).length
        }
        return blogObject
    }).sort((a, b) => b.blogs - a.blogs)

    return blogCountsSorted[0]
}

const mostLikes = (blogs) => {
    const blogLikesSorted = blogs.map(blog => {
        const blogObject = {
            author: blog.author,
            likes: blogs.filter(blogFilter => blogFilter.author === blog.author).reduce((previous, current) => {
                return previous + current.likes
            }, 0)
        }
        return blogObject
    }).sort((a, b) => b.likes - a.likes)

    return blogLikesSorted[0]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}