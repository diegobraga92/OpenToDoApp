package com.example.opentodo.ui

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.opentodo.R

class ListsFragment : Fragment(R.layout.fragment_lists_page) {
    private var selectedCollection: UiCollection? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val newCollectionInput = view.findViewById<EditText>(R.id.newCollectionInput)
        val addCollectionButton = view.findViewById<Button>(R.id.addCollectionButton)

        val selectedListLabel = view.findViewById<TextView>(R.id.selectedListLabel)
        val newTaskInput = view.findViewById<EditText>(R.id.newCollectionTaskInput)
        val addTaskButton = view.findViewById<Button>(R.id.addCollectionTaskButton)

        val collectionRecycler = view.findViewById<RecyclerView>(R.id.collectionRecycler)
        val tasksRecycler = view.findViewById<RecyclerView>(R.id.collectionTaskRecycler)

        val taskAdapter = TaskListAdapter(mutableListOf())
        tasksRecycler.layoutManager = LinearLayoutManager(requireContext())
        tasksRecycler.adapter = taskAdapter

        fun refreshSelectedCollection() {
            val title = selectedCollection?.name ?: "Select a list"
            selectedListLabel.text = title
            taskAdapter.setTasks(selectedCollection?.tasks ?: mutableListOf())
        }

        val collectionAdapter = CollectionListAdapter(InMemoryUiStore.collections) {
            selectedCollection = it
            refreshSelectedCollection()
        }

        collectionRecycler.layoutManager = LinearLayoutManager(requireContext())
        collectionRecycler.adapter = collectionAdapter

        if (InMemoryUiStore.collections.isNotEmpty()) {
            selectedCollection = InMemoryUiStore.collections.first()
            refreshSelectedCollection()
        }

        addCollectionButton.setOnClickListener {
            val name = newCollectionInput.text.toString().trim()
            if (name.isEmpty()) return@setOnClickListener

            val newCollection = UiCollection(name = name)
            InMemoryUiStore.collections.add(newCollection)
            collectionAdapter.notifyItemInserted(InMemoryUiStore.collections.lastIndex)
            selectedCollection = newCollection
            refreshSelectedCollection()
            newCollectionInput.text?.clear()
        }

        addTaskButton.setOnClickListener {
            val selected = selectedCollection ?: return@setOnClickListener
            val title = newTaskInput.text.toString().trim()
            if (title.isEmpty()) return@setOnClickListener

            selected.tasks.add(UiTask(title = title))
            taskAdapter.setTasks(selected.tasks)
            newTaskInput.text?.clear()
        }
    }
}
