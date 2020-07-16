import java.awt.BorderLayout;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;

import javax.swing.ButtonGroup;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBoxMenuItem;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JRadioButtonMenuItem;
import javax.swing.JTabbedPane;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.Timer;

import com.frc2367.stats.Stats;

public class GUI {
	public final static int numberOfDefenses = 9;
	// list goes port, cdf, moat, ramp, draw, sally, wall, terr, lowbar
	private JCheckBoxMenuItem[] autoChecks = new JCheckBoxMenuItem[numberOfDefenses];
	private JCheckBoxMenuItem[] teleChecks = new JCheckBoxMenuItem[numberOfDefenses];
	private JRadioButtonMenuItem[] autoBalls = new JRadioButtonMenuItem[6];
	private JRadioButtonMenuItem[] autoCapabilities = new JRadioButtonMenuItem[3];
	private JCheckBoxMenuItem[] teleCapabilities = new JCheckBoxMenuItem[2];
	private JRadioButtonMenuItem[] towerAttack = new JRadioButtonMenuItem[3];
	private JLabel teamNumberLabel = new JLabel("Team Number");
	private JTextField teamNumberField = new JTextField("0");
	private JLabel robotNameLabel = new JLabel("Robot Name");
	private JTextField robotNameField = new JTextField("null");
	private JLabel speed1Label = new JLabel("Speed 1 (ft/sec)");
	private JTextField speed1Field = new JTextField("0");
	private JLabel speed2Label = new JLabel("Speed 2(ft/sec)");
	private JTextField speed2Field = new JTextField("0");
	private JLabel teamNameLabel = new JLabel("Team Name");
	private JTextField teamNameField = new JTextField("null");
	private JTextArea noteArea = new JTextArea();

	private ArrayList<PitTeam> pitTeams = new ArrayList<PitTeam>();

	// list goes port, cdf, moat, ramp, draw, sally, wall, terr, lowbar
	private boolean[] autoDefenses = new boolean[numberOfDefenses];
	private boolean[] teleDefenses = new boolean[numberOfDefenses];
	private boolean teleHigh, teleLow = false;
	// 0 no goals, 1 one low goal, 2 one high goal, 3 one low and one high, 4
	// two low goals, 5 two high goals
	private int autoShooter = 0;
	// 0 no move, 1 reach defense, 2 cross defense
	private int autoDefenseReach = 0;
	// 0 no attack, 1 challenge, 2 climb
	private int towerAttackCapability = 0;

	private int teamNumber = 0;
	private double speed1, speed2;
	private String robotName, teamName, notes;

	// Frame and panel stuff
	private JTabbedPane tabs = new JTabbedPane();
	private JPanel pitData = new JPanel(new BorderLayout());
	private JPanel pitDataInfo = new JPanel(new GridLayout(2, 2));
	private JPanel scoutedTeamDataPanel = new JPanel(new GridLayout(8, 1));
	private JPanel basicStatPanel = new JPanel(new GridLayout(8, 2));
	private ImageIcon pitDataIcon = new ImageIcon("Icons/FIRST Logo.gif");
	private ImageIcon basicStatPanelIcon = new ImageIcon("Icons/stronghold.png");
	private ImageIcon scoutedTeamDataIcon = new ImageIcon("Icons/Boulder.png");
	private ImageIcon overallTrendsPanelIcon = new ImageIcon("Icons/graph.png");
	private boolean isFullscreen = false;
	final GraphicsDevice device = GraphicsEnvironment.getLocalGraphicsEnvironment().getScreenDevices()[0];
	final JFrame mainFrame = new JFrame("Scoutr");
	private JButton submitButton = new JButton("Submit");

	private Timer t;

	// stats graphs
	private Stats stats;
	private JComboBox<String> xAxisBox = new JComboBox<String>(new String[] { "auto boulders low", "auto boulders high",
			"teleop boulders low", "teleop boulders high", "tower end strength", "foul count", "tech foul count",
			"auto points", "auto reach points", "auto crossing points", "auto boulder points", "teleop points",
			"teleop crossing points", "teleop boulder points", "teleop challenge points", "teleop scale points",
			"foul points", "total points", "rookie year", "team number" });
	private JComboBox<String> yAxisBox = new JComboBox<String>(new String[] { "auto boulders low", "auto boulders high",
			"teleop boulders low", "teleop boulders high", "tower end strength", "foul count", "tech foul count",
			"auto points", "auto reach points", "auto crossing points", "auto boulder points", "teleop points",
			"teleop crossing points", "teleop boulder points", "teleop challenge points", "teleop scale points",
			"foul points", "total points", "rookie year", "team number" });

	private JPanel overallTrends = new JPanel(new BorderLayout());

	class GeneralListener implements KeyListener, ActionListener {

		boolean ctrl = false;

		@Override
		public void keyTyped(KeyEvent e) {
			// Unused

		}

		@Override
		public void keyPressed(KeyEvent e) {
			if (e.getKeyCode() == KeyEvent.VK_CONTROL)
				ctrl = true;
			if (e.getKeyCode() == KeyEvent.VK_1 || e.getKeyCode() == KeyEvent.VK_NUMPAD1) {
				if (ctrl)
					tabs.setSelectedIndex(0);
			}
			if (e.getKeyCode() == KeyEvent.VK_2 || e.getKeyCode() == KeyEvent.VK_NUMPAD2) {
				if (ctrl)
					tabs.setSelectedIndex(1);
			}
			if (e.getKeyCode() == KeyEvent.VK_3 || e.getKeyCode() == KeyEvent.VK_NUMPAD3) {
				if (ctrl)
					tabs.setSelectedIndex(2);
			}
			if (e.getKeyCode() == KeyEvent.VK_F) {
				if (ctrl && !isFullscreen) {
					device.setFullScreenWindow(mainFrame);
					isFullscreen = true;
				} else if (ctrl && isFullscreen) {
					device.setFullScreenWindow(null);
					isFullscreen = false;
				}
			}
			if (e.getKeyCode() == KeyEvent.VK_SPACE) {
				if (ctrl)
					if (tabs.getSelectedIndex() < 3)
						tabs.setSelectedIndex(tabs.getSelectedIndex() + 1);
					else
						tabs.setSelectedIndex(0);
			}

		}

		@Override
		public void keyReleased(KeyEvent e) {
			if (e.getKeyCode() == KeyEvent.VK_CONTROL)
				ctrl = false;
		}

		@Override
		public void actionPerformed(ActionEvent e) {
			if (e.getSource() == t) {
				notes = noteArea.getText();
			} else {

				// getting defense capabilities
				for (int i = 0; i < numberOfDefenses; i++) {
					autoDefenses[i] = autoChecks[i].isSelected();
					teleDefenses[i] = teleChecks[i].isSelected();
				}

				// getting auto shooter capabilities
				for (int i = 0; i < autoBalls.length; i++) {
					if (autoBalls[i].isSelected())
						autoShooter = i;
				}
				// reach, cross defense in auto
				for (int i = 0; i < autoCapabilities.length; i++) {
					if (autoCapabilities[i].isSelected())
						autoDefenseReach = i;
				}

				// teleop shooter high, low ability
				if (teleCapabilities[0].isSelected())
					teleLow = true;
				if (teleCapabilities[1].isSelected())
					teleHigh = true;

				// tower attack capability
				for (int i = 0; i < towerAttack.length; i++) {
					if (towerAttack[i].isSelected())
						towerAttackCapability = i;
				}

				// team number and other string info
				try {
					teamNumber = Integer.parseInt(teamNumberField.getText());

				} catch (Exception ex) {
					teamNumberField.setText("INVALID");
				}
				try {
					speed1 = Double.parseDouble(speed1Field.getText());
					speed2 = Double.parseDouble(speed2Field.getText());
				} catch (Exception ex) {
					speed1Field.setText("INVALID");
					speed2Field.setText("INVALID");
				}
				robotName = robotNameField.getText();
				teamName = teamNameField.getText();

				pitTeams.add(new PitTeam(getAutoDefenses(), getTeleDefenses(), getTeleHigh(), getTeleLow(),
						getAutoShooter(), getAutoDefenseReach(), getTowerAttackCapability(), getSpeed1(), getSpeed2(),
						getRobotName(), getTeamNumber(), getTeamName(), getNotes()));

			}
		}

	}

	public GUI() {

		// Tab setup
		tabs.addTab("Pit Data", pitDataIcon, pitData, "Enter pit data here.");
		tabs.setMnemonicAt(0, KeyEvent.VK_1);
		tabs.addTab("Individual Team Data", scoutedTeamDataIcon, scoutedTeamDataPanel,
				"See data about an individual team here.");
		tabs.setMnemonicAt(1, KeyEvent.VK_2);
		tabs.addTab("Individual Team Stats", basicStatPanelIcon, basicStatPanel, "See Team Stats");
		tabs.setMnemonicAt(2, KeyEvent.VK_3);
		tabs.addTab("Overall Trends", overallTrendsPanelIcon, overallTrends, "See the overall trends here");
		tabs.setMnemonicAt(3, KeyEvent.VK_4);

		setupPitData();

		// frame setup
		mainFrame.add(tabs);
		mainFrame.setSize(1000, 600);
		mainFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		mainFrame.setVisible(true);
		tabs.addKeyListener(new GeneralListener());
		submitButton.addActionListener(new GeneralListener());

		// all the action listeners!
		GeneralListener gl = new GeneralListener();
		t = new Timer(1000, gl);

		for (int i = 0; i < autoChecks.length; i++) {
			autoChecks[i].addActionListener(gl);
			teleChecks[i].addActionListener(gl);
		}
		for (int i = 0; i < autoBalls.length; i++)
			autoBalls[i].addActionListener(gl);
		for (int i = 0; i < autoCapabilities.length; i++) {
			autoCapabilities[i].addActionListener(gl);
			towerAttack[i].addActionListener(gl);
		}
		for (int i = 0; i < teleCapabilities.length; i++)
			teleCapabilities[i].addActionListener(gl);

		teamNumberField.addActionListener(gl);
		robotNameField.addActionListener(gl);
		speed1Field.addActionListener(gl);
		speed2Field.addActionListener(gl);
		teamNameField.addActionListener(gl);

		setupScoutedTeamData();
		t.start();
		stats = new Stats();
		setupTeamStats();

		setupTrends();

	}

	public void setupPitData() {
		pitData.add(pitDataInfo, BorderLayout.CENTER);
		pitData.add(submitButton, BorderLayout.SOUTH);
		// top left, defenses (auto and tele)
		JPanel tl = new JPanel(new GridLayout(numberOfDefenses + 1, 2));
		tl.add(new JLabel("Autonomous"));
		tl.add(new JLabel("Teleoperated"));
		for (int i = 0; i < autoChecks.length; i++) {
			switch (i) {
			case 0:
				autoChecks[i] = new JCheckBoxMenuItem("Portcullis", new ImageIcon("Icons/portcullis.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Portcullis", new ImageIcon("Icons/portcullis.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 1:
				autoChecks[i] = new JCheckBoxMenuItem("Cheval De Frise", new ImageIcon("Icons/cdf.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Cheval De Frise", new ImageIcon("Icons/cdf.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 2:
				autoChecks[i] = new JCheckBoxMenuItem("Moat", new ImageIcon("Icons/moat.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Moat", new ImageIcon("Icons/moat.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 3:
				autoChecks[i] = new JCheckBoxMenuItem("Ramparts", new ImageIcon("Icons/ramparts.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Ramparts", new ImageIcon("Icons/ramparts.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 4:
				autoChecks[i] = new JCheckBoxMenuItem("Drawbridge", new ImageIcon("Icons/drawbridge.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Drawbridge", new ImageIcon("Icons/drawbridge.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 5:
				autoChecks[i] = new JCheckBoxMenuItem("Sally Port", new ImageIcon("Icons/sallyport.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Sally Port", new ImageIcon("Icons/sallyport.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 6:
				autoChecks[i] = new JCheckBoxMenuItem("Rock Wall", new ImageIcon("Icons/rockwall.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Rock Wall", new ImageIcon("Icons/rockwall.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 7:
				autoChecks[i] = new JCheckBoxMenuItem("Rough Terrain", new ImageIcon("Icons/roughterrain.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Rough Terrain", new ImageIcon("Icons/roughterrain.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			case 8:
				autoChecks[i] = new JCheckBoxMenuItem("Low Bar", new ImageIcon("Icons/lowbar.png"));
				teleChecks[i] = new JCheckBoxMenuItem("Low Bar", new ImageIcon("Icons/lowbar.png"));
				tl.add(autoChecks[i]);
				tl.add(teleChecks[i]);
				break;
			}
		}

		// top right, basic robot functions, autonomous functions,
		// make sure to include 1 ball auto AND 2 ball auto
		JPanel tr = new JPanel(new GridLayout(1, 2));
		JPanel autoBallGroupPanel = new JPanel(new GridLayout(7, 1));
		tr.add(autoBallGroupPanel);

		// autonomous Shooter Stuff, radio buttons
		autoBallGroupPanel.add(new JLabel("Autonomous Shooter Capabilities"));
		ButtonGroup autoBallGroup = new ButtonGroup();

		autoBalls[0] = new JRadioButtonMenuItem("Zero Boulders");
		autoBalls[1] = new JRadioButtonMenuItem("1 Low Goal");
		autoBalls[2] = new JRadioButtonMenuItem("1 High Goal");
		autoBalls[3] = new JRadioButtonMenuItem("1 Low and 1 High");
		autoBalls[4] = new JRadioButtonMenuItem("2 Low Goals");
		autoBalls[5] = new JRadioButtonMenuItem("2 High Goals");
		for (int i = 0; i < autoBalls.length; i++) {
			autoBallGroup.add(autoBalls[i]);
			autoBallGroupPanel.add(autoBalls[i]);
		}

		JPanel trRightSide = new JPanel(new GridLayout(11, 1));
		tr.add(trRightSide);

		// autonomous defenses
		ButtonGroup autoCapabilitiesGroup = new ButtonGroup();

		autoCapabilities[0] = new JRadioButtonMenuItem("Does not reach or cross defense");
		autoCapabilities[1] = new JRadioButtonMenuItem("Reach defense");
		autoCapabilities[2] = new JRadioButtonMenuItem("Cross Defense");
		trRightSide.add(new JLabel("Autonomous Capabilities"));
		for (int i = 0; i < autoCapabilities.length; i++) {
			autoCapabilitiesGroup.add(autoCapabilities[i]);
			trRightSide.add(autoCapabilities[i]);
		}

		// teleop shooter capabilities

		teleCapabilities[0] = new JCheckBoxMenuItem("Low Goal");
		teleCapabilities[1] = new JCheckBoxMenuItem("High Goal");
		trRightSide.add(new JLabel("Teleop Capabilities"));
		for (int i = 0; i < teleCapabilities.length; i++) {
			trRightSide.add(teleCapabilities[i]);
		}

		// tower abilities
		ButtonGroup towerAttackGroup = new ButtonGroup();

		towerAttack[0] = new JRadioButtonMenuItem("Cannot Attack Tower");
		towerAttack[1] = new JRadioButtonMenuItem("Can Challenge");
		towerAttack[2] = new JRadioButtonMenuItem("Can Scale");
		trRightSide.add(new JLabel("Tower Attack Capabilities"));
		for (int i = 0; i < towerAttack.length; i++) {
			towerAttackGroup.add(towerAttack[i]);
			trRightSide.add(towerAttack[i]);
		}

		// bottom left, data input, speed, tean number, name, etc
		JPanel bl = new JPanel(new GridLayout(5, 2));

		bl.add(teamNumberLabel);
		bl.add(teamNumberField);
		bl.add(robotNameLabel);
		bl.add(robotNameField);
		bl.add(speed1Label);
		bl.add(speed1Field);
		bl.add(speed2Label);
		bl.add(speed2Field);
		bl.add(teamNameLabel);
		bl.add(teamNameField);

		// bottom right, notes and whatever else i can think of
		JPanel br = new JPanel(new BorderLayout());
		br.add(new JLabel("Notes"), BorderLayout.NORTH);
		br.add(noteArea, BorderLayout.CENTER);

		pitDataInfo.add(tl);
		pitDataInfo.add(tr);
		pitDataInfo.add(bl);
		pitDataInfo.add(br);
	}

	public void setupTrends() {
		JPanel topComboBoxes = new JPanel(new GridLayout(2, 2));
		overallTrends.add(topComboBoxes, BorderLayout.NORTH);
		topComboBoxes.add(new JLabel("x-axis", SwingConstants.CENTER));
		topComboBoxes.add(new JLabel("y-axis", SwingConstants.CENTER));
		topComboBoxes.add(xAxisBox);
		topComboBoxes.add(yAxisBox);
		overallTrends.add(stats.displayChart(18, 17));
		class TeamListener implements ActionListener {

			@Override
			public void actionPerformed(ActionEvent e) {
				overallTrends.remove(1);
				overallTrends.add(stats.displayChart(xAxisBox.getSelectedIndex(), yAxisBox.getSelectedIndex()));
			}

		}
		TeamListener tl = new TeamListener();
		xAxisBox.addActionListener(tl);
		yAxisBox.addActionListener(tl);
	}

	public void setupTeamStats() {

		JLabel teamNumLabel = new JLabel("team number");
		JLabel aveScoreLabel = new JLabel("average score");
		JLabel aveAutoScoreLabel = new JLabel("average auto score");
		JLabel aveTeleopScoreLabel = new JLabel("average teleop score");
		JLabel breachPercentLabel = new JLabel("Breach %");
		JLabel capPercentLabel = new JLabel("Capture %");

		final JTextField teamSelection = new JTextField(0);
		final JLabel aveScore = new JLabel("0");
		final JLabel aveAutoScore = new JLabel("0");
		final JLabel aveTeleop = new JLabel("0");
		final JLabel breach = new JLabel("0");
		final JLabel cap = new JLabel("0");

		basicStatPanel.add(teamNumLabel);
		basicStatPanel.add(teamSelection);
		basicStatPanel.add(aveScoreLabel);
		basicStatPanel.add(aveScore);
		basicStatPanel.add(aveAutoScoreLabel);
		basicStatPanel.add(aveAutoScore);
		basicStatPanel.add(aveTeleopScoreLabel);
		basicStatPanel.add(aveTeleop);
		basicStatPanel.add(breachPercentLabel);
		basicStatPanel.add(breach);
		basicStatPanel.add(capPercentLabel);
		basicStatPanel.add(cap);

		class StatListener implements ActionListener {

			@Override
			public void actionPerformed(ActionEvent e) {
				String teamNumStr = teamSelection.getText();
				int teamNum = Integer.parseInt(teamNumStr);
				if (stats.validateTeamNum(teamNum)) {
					aveScore.setText(String.valueOf(stats.getAverageScore(teamNum)));
					aveAutoScore.setText(String.valueOf(stats.getAverageAutoScore(teamNum)));
					aveTeleop.setText(String.valueOf(stats.getAverageTeleopScore(teamNum)));
					breach.setText(String.valueOf(stats.getBreachPercent(teamNum)));
					cap.setText(String.valueOf(stats.getCapturePercent(teamNum)));
				}
			}

		}

		StatListener sl = new StatListener();
		teamSelection.addActionListener(sl);

	}

	public void setupScoutedTeamData() {
		PitTeam pt;

		JLabel teamNumLabel = new JLabel("team number");
		final JTextField teamSelection = new JTextField(0);

		JPanel teamNum = new JPanel(new GridLayout(1, 2));
		teamNum.add(teamNumLabel);
		teamNum.add(teamSelection);

		scoutedTeamDataPanel.add(teamNum);
		final JLabel robotName, speed1, speed2, note, teleHigh, teleLow, teamName;

		robotName = new JLabel("Robot Name: ");
		speed1 = new JLabel("Speed 1: ");
		speed2 = new JLabel("Speed 2 (if applicable): ");
		note = new JLabel("Note: ");
		teleHigh = new JLabel("Can Teleop High?: ");
		teleLow = new JLabel("Can Teleop Low? ");
		teamName = new JLabel("Team Name: ");

		class DataListener implements ActionListener {

			@Override
			public void actionPerformed(ActionEvent e) {
				String teamNumStr = teamSelection.getText();
				int teamNum = Integer.parseInt(teamNumStr);

				boolean hasTeam = false;
				for (int i = 0; i < pitTeams.size(); i++) {
					if (pitTeams.get(i).getTeamNumber() == teamNum) {
						robotName.setText("Robot Name: " + pitTeams.get(i).getRobotName());
						speed1.setText("Speed 1: " + pitTeams.get(i).getSpeed1());
						speed2.setText("Speed 2 (if applicable): " + pitTeams.get(i).getSpeed2());
						note.setText("Note: " + pitTeams.get(i).getNotes());
						teleHigh.setText("Can Teleop High?: " + pitTeams.get(i).getTeleHigh());
						teleLow.setText("Can Teleop Low? " + pitTeams.get(i).getTeleLow());
						teamName.setText("Team Name: " + pitTeams.get(i).getTeamName());
					}
				}

			}

		}
		DataListener dl = new DataListener();
		teamSelection.addActionListener(dl);

		scoutedTeamDataPanel.add(robotName);
		scoutedTeamDataPanel.add(teamName);
		scoutedTeamDataPanel.add(speed1);
		scoutedTeamDataPanel.add(speed2);
		scoutedTeamDataPanel.add(teleHigh);
		scoutedTeamDataPanel.add(teleLow);
		scoutedTeamDataPanel.add(note);

	}

	// list goes port, cdf, moat, ramp, draw, sally, wall, terr, lowbar
	public boolean[] getAutoDefenses() {
		return autoDefenses;
	}

	public boolean[] getTeleDefenses() {
		return teleDefenses;
	}

	public boolean getTeleHigh() {
		return teleHigh;
	}

	public boolean getTeleLow() {
		return teleLow;
	}

	public int getAutoShooter() {
		return autoShooter;
	}

	public int getAutoDefenseReach() {
		return autoDefenseReach;
	}

	public int getTowerAttackCapability() {
		return towerAttackCapability;
	}

	public int getTeamNumber() {
		return teamNumber;
	}

	public double getSpeed1() {
		return speed1;
	}

	public double getSpeed2() {
		return speed2;
	}

	public String getRobotName() {
		return robotName;
	}

	public String getTeamName() {
		return teamName;
	}

	public String getNotes() {
		return notes;
	}

}