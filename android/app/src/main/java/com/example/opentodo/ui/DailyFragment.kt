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

class DailyFragment : Fragment(R.layout.fragment_task_page) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        view.findViewById<TextView>(R.id.pageTitle).text = "Daily"
        view.findViewById<TextView>(R.id.pageSubtitle).text = "Recurring routine tasks"

        val taskInput = view.findViewById<EditText>(R.id.newTaskInput)
        val addButton = view.findViewById<Button>(R.id.addTaskButton)
        val recycler = view.findViewById<RecyclerView>(R.id.taskRecycler)

        val adapter = TaskListAdapter(InMemoryUiStore.dailyTasks)
        recycler.layoutManager = LinearLayoutManager(requireContext())
        recycler.adapter = adapter

        addButton.setOnClickListener {
            val title = taskInput.text.toString().trim()
            if (title.isEmpty()) return@setOnClickListener

            InMemoryUiStore.dailyTasks.add(UiTask(title = title))
            adapter.notifyItemInserted(InMemoryUiStore.dailyTasks.lastIndex)
            taskInput.text?.clear()
        }
    }
}
