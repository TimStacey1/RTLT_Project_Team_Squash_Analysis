import React from 'react';

const annotations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export default function MainMenu() {
  return (

    <div className="container mx-auto mb-10">
      
    <div className="grid grid-cols-12">
      <div className="px-5 py-3 col-span-12">
    <h2 class="text-2xl sm:text-3xl font-bold leading-7 text-gray-900">
    <button className="float-right text-xl hidden sm:block bg-green-700 hover:bg-green-600  text-white font-bold py-2 px-4 mx-1">New Annotation</button>
    <button className="float-right text-xl block sm:hidden bg-green-700 hover:bg-green-600  text-white font-bold pb-2 px-4 mx-1"> <span className="align-middle">+</span></button>

      <span className="align-middle">Current Annotations </span>

    </h2>

    </div>
    
    {
    annotations.map(annotation => {
      return(
        <div className="p-5 col-span-12 sm:col-span-6 lg:col-span-4">
          <div className="overflow-hidden shadow-lg">
          <div className="p-4">

          <div className="font-bold text-xl mb-3">Example Match {annotation}</div>
            <iframe src="https://www.youtube.com/embed/IzfAI4QRv-k" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <p className="text-gray-700 mt-2 text-base">
                <strong> Player {annotation} vs Player {annotation+1} </strong>
              </p>
              <p>Description goes here. </p>
            <div className="pt-3 pb-2">
              <a href="/view_this"><button className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 mx-1">View</button> </a>
              <a href="/edit_this"><button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-1">Edit</button></a>
            </div>
          </div>
          </div>
          </div>

      )
    }

  )

}
</div>
</div>
)
}
