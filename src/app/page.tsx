"use client";
import Head from "next/head";
import { useState, useEffect } from "react";
import { supabase } from "../../client";

export default function Home() {
  // Declare a new state variable to store post details
  const [loading, setLoading] = useState(true);

  const [post, setPost] = useState({
    title: "",
    description: "",
  });

  const { title, description } = post;
  // Create a function that handles the new post creation
  async function addPost() {
    await supabase
      .from("BlogList") // Select the Table
      .insert([
        {
          title,
          description,
        },
      ]) // Insert the new task
      .single();

    // Reset the task details
    setPost({
      title: "",
      description: "",
    });

    getPosts();
  }

  const [posts, setPosts] = useState<
    { id: BigInteger; created_at: String; title: String; description: String }[]
  >([]);
  async function getPosts() {
    const { data } = await supabase.from("BlogList").select(); // Select all the tasks from the Task Table
    if (data !== null) {
      setLoading(false);
      setPosts(data);
    }
    console.log(posts);
  }

  async function deleteTask(id: BigInteger) {
    await supabase.from("BlogList").delete().eq("id", id); // the id of row to delete
    getPosts();
  }

  // Run the getTasks function when the component is mounted
  useEffect(() => {
    getPosts();
  }, []);

  // Check if loading
  if (loading)
    return (
      <div className="flex justify-center items-center">
        <div
          className="
      animate-spin
      rounded-full
      h-32
      w-32
      border-t-2 border-b-2 border-blue-500 mt-36
    "
        ></div>
      </div>
    );
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div>
        <Head>
          <title>Supabase and NextJs Demo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-4xl font-bold mt-20">
            <a className="text-blue-600" href="/">
              Create a simple blog app
            </a>
          </h1>

          <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
            <div className="p-8 mt-6 border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
              <div className="w-full max-w-sm">
                <form className="bg-white rounded px-8 pt-6 pb-8 mb-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="title"
                    >
                      Title
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="title"
                      type="text"
                      value={title.toString()}
                      onChange={(e) =>
                        setPost({ ...post, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="description"
                    >
                      Description
                    </label>

                    <textarea
                      className="form-textarea mt-1 block shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="description"
                      placeholder="Description"
                      value={description.toString()}
                      onChange={(e) =>
                        setPost({ ...post, description: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="button"
                      onClick={addPost}
                    >
                      Add Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-around mt-6 sm:w-full">
            <div className="p-2 mt-6 rounded-xl focus:text-blue-600">
              <table className="shadow-lg">
                <tbody>
                  <tr>
                    <th className="bg-blue-400 border text-left px-4 py-4">
                      S/N
                    </th>
                    <th className="bg-blue-400 border text-left px-8 py-4">
                      Title
                    </th>
                    <th className="bg-blue-400 border text-left px-8 py-4">
                      Description
                    </th>
                    <th className="bg-blue-400 border text-left px-14 py-4">
                      created Date
                    </th>
                    <th className="bg-blue-400 border text-left px-4 py-4">
                      Action
                    </th>
                  </tr>
                  {posts &&
                    posts.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-4">{index + 1}</td>
                        <td className="border px-4 py-4">{item.title}</td>
                        <td className="border px-4 py-4">{item.description}</td>
                        <td className="border px-4 py-4">{item.created_at}</td>
                        <td className="border px-8 py-4">
                          {" "}
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => deleteTask(item.id)} // Delete the task
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
